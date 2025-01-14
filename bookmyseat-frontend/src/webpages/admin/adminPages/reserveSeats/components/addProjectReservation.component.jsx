import { ChevronDown } from "lucide-react";
import styles from "../styles/addProjectReservation.module.css";
import { TerraceTrainingRoom } from "../../../../floorMap/components/terraceTrainingRoom.module";
import { ThirdFloorMap } from "../../../../floorMap/components/thirdFloor.component";
import { SecondFloor } from "../../../../floorMap/components/secondFloor.component";
import { FirstFloor } from "../../../../floorMap/components/firstFloor.component";
import { MezzanineFloor } from "../../../../floorMap/components/mezzanineFloorMap.component";
import { GroundFloorMap } from "../../../../floorMap/components/groundFloorMap.component";
import { useEffect, useState } from "react";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";

export const AddProjectReservation = () => {
  // state to handle map visibility
  const [mapVisibility, setMapVisibility] = useState(false);
  // state to store selected seat from map
  const [selectedSeat, setSelectedSeat] = useState(null);
  // state to store floor
  const [floors, setFloors] = useState();
  // state to store custom dropdown for floor visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // state to store custom dropdown visibility - for projects
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  // state to store selected floor
  const [selectedFloor, setSelectedFloor] = useState(null);
  // state to store selected project
  const [selectedProject, setSelectedProject] = useState(null);

  // state to store selected/input User details
  const [selectedUser, setSelectedUser] = useState();

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // state to store projects
  const [projects, setProjects] = useState([]);
  // state to store count of total seats to reserve
  const [totalSeats, setTotalSeats] = useState(null);
  // state to store list of seats tp store
  const [seatsToReserve, setSeatsToReserve] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  // getting token from session storage
  const token = sessionStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = token;
  // getting and storing Project details from server
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:9006/bookmyseat/admin/projects")
        .then((response) => {
          setProjects(response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Error Fetching projects!. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  //Function to get and store floors details from server
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:9006/bookmyseat/admin/floors")
        .then((response) => {
          setFloors(response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Error fetching floor Details. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // Function to handle selecting a seat
  const handleSeatSelection = ({ seatNumber, seatId }) => {
    setSelectedUser((prevstate) => ({
      ...prevstate,
      seatNumber: seatNumber,
      seatId: seatId,
    }));
    setSelectedSeat(seatNumber);
  };

  // function to handle floor selection
  const handleFloorSelect = (floorId, floorName) => {
    setSelectedFloor(floorId);
    setSelectedUser((prevstate) => ({ ...prevstate, floor: floorName }));
    setDropdownOpen(false);
    openMap(floorId);
  };
  // state to hold map content
  const [mapContent, setMapContent] = useState(null);
  const openMap = (floorId) => {
    const content = getMapContent(floorId);
    setMapContent(content);
    setMapVisibility(true);
  };
  // opening map of selected floor
  const getMapContent = (floorId) => {
    switch (floorId) {
      case 1:
        return (
          // Rendering ground floor
          <GroundFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 2:
        return (
          // Rendering Mezzanine floor
          <MezzanineFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 3:
        return (
          // Rendering First floor
          <FirstFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 4:
        return (
          // Rendering Second floor
          <SecondFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 5:
        return (
          <ThirdFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 6:
        return (
          // Rendering Terrace floor
          <TerraceTrainingRoom
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      default:
        return null; // Return null for unrecognized floor IDs
    }
  };

  // handling project selction
  const handleProjectSelection = (projectId, projectName) => {
    setSelectedProject(projectId);
    setProjectDropdownOpen(false);
  };
  // storing the number of seats to reserve
  const storeAllSeatsToReserve = (e) => {
    // only allowing to book 20 seats at a time
    if (e.target.value > 20) {
      setErrorMessage("Only a maximum of 20 seats are allowed at a time.");
      setTotalSeats(0);
    } else {
      setTotalSeats(e.target.value);
      const seatNumber = selectedUser.seatNumber;
      const seatId = selectedUser.seatId;
      const seatsArray = Array.from({ length: e.target.value }, (_, index) => ({
        seatNumber: seatNumber + index,
        seatId: seatId + index,
      }));
      setSeatsToReserve(seatsArray);
    }
  };
  // reserving seats to selected roject
  const reserveProjectSeats = () => {
    // check if all the fields are filled
    if (!selectedProject || !selectedFloor || !totalSeats) {
      setErrorMessage("Please fill in all required fields");
    } else {
      const seats = seatsToReserve.map((val) => val.seatId);
      const projectId = selectedProject;
      const fetchData = () => {
        axios
          .post(
            "http://localhost:9006/bookmyseat/admin/seatrestriction/project/add",
            { projectId, seats }
          )
          .then((response) => {
            // console.log(response);
            setModalHeading("Success");
            setModalMessage("Seats Reserved for the project successfully.");
            setShowToaster(true);
          })
          .catch((error) => {
            console.log(error);
            setModalHeading("Error");
            setModalMessage(
              "Something went wrong while saving Reservation for Project. Please try again."
            );
            setShowToaster(true);
          });
      };
      fetchData();
    }
  };

  return (
    <>
      {/* main form container */}
      <div>
        <h1 className={styles.heading}>Add Project Reservation</h1>
        <h1 className={styles.errorMessage}>
          {errorMessage ? errorMessage : ""}
        </h1>
      </div>
      <div className={styles.formContainer}>
        {/* project list dropdown */}
        <div>
          <label htmlFor="project" className={styles.formLabel}>
            Select Project <span style={{ color: "red" }}>*</span>
          </label>
          {/* custom dropdown for projects */}
          <div className={styles.customDropdown}>
            <div
              className={styles.dropdownLabel}
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            >
              {selectedProject
                ? projects.find((project) => project.id === selectedProject)
                    .projectName
                : "Select Project"}{" "}
              <ChevronDown />
            </div>
            {projectDropdownOpen && (
              <div className={styles.dropdownList}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      handleProjectSelection(project.id, project.projectName);
                    }}
                  >
                    {project.projectName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* floor dropdown */}
        <div>
          <label htmlFor="floor" className={styles.formLabel}>
            Select Floor <span style={{ color: "red" }}>*</span>
          </label>
          <div className={styles.floorSelection}>
            <div className={styles.customDropdown}>
              <div
                className={styles.dropdownLabel}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedFloor
                  ? floors.find((floor) => floor.id === selectedFloor).floorName
                  : "Select Floor"}{" "}
                <ChevronDown />
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownList}>
                  {floors.map((floor) => (
                    <div
                      key={floor.id}
                      className={`${styles.dropdownItem}`}
                      onClick={() => {
                        handleFloorSelect(floor.id, floor.floorName);
                      }}
                    >
                      {floor.floorName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Selected Seat Number Container */}
        <div>
          <label className={styles.formLabel} htmlFor="seatNumber">
            Selected Start Seat Number
          </label>
          {/* selected seat Container */}
          <input
            className={styles.formInput}
            type="text"
            name="seatNumber"
            id="seatNumber"
            placeholder="Seat Number"
            value={selectedSeat}
            readOnly
          />
        </div>
        {/* container to accept total seats to reserve */}
        <div>
          <label htmlFor="totalSeats" className={styles.formLabel}>
            Total Seats to Reserve <span style={{ color: "red" }}>*</span>
          </label>
          {/* Input for search query */}
          <input
            className={styles.formInput}
            type="number"
            id="totalSeats"
            name="totalSeats"
            placeholder="Total Seats to Reserve"
            autoComplete="off"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={5}
            max={20}
            value={totalSeats}
            onChange={storeAllSeatsToReserve}
          />
        </div>
        {/* textarea to display seat numbers of seats to reserve */}
        <div>
          <textarea
            placeholder="Seat Numbers of Selected Seats."
            readOnly
            className={`${styles.formInput} ${styles.seatNumbers}`}
            rows={4}
            cols={50}
            value={seatsToReserve.map((seat) => seat.seatNumber).join(", ")}
          />
        </div>
        <button className={styles.reserveProject} onClick={reserveProjectSeats}>
          Reserve Seats
        </button>
      </div>
      {/* map modal */}
      <div className={styles.mapModal}>
        {/* <button onClick={openMap}>open floor</button> */}
        {mapVisibility && mapContent}
      </div>
      {/* modal displaying error/success messages */}

      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </>
  );
};
