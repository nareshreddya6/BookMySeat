import { useEffect, useState } from "react";
import styles from "../styles/firstFloorMap.module.css";
import axios from "axios";
import { Laptop2 } from "lucide-react";
import ResponseModal from "../../messageModal/responseModal";
import Toaster from "../../toaster/components/toaster.component";
export const FirstFloor = ({
  onSeatSelect,
  setMapContent,
  isAdmin,
  mapData,
  userInformation,
  setMapVisibility,
}) => {
  // seat number Count to start from
  let totalSeatCount = 1;
  // seat Id count to start from
  let seatIdCount = 167;

  // states to hold different information

  // storing selected seat information
  const [selectedSeat, setSelectedSeat] = useState();
  // storing Booked Seats Details
  const [bookedSeatsDetails, setBookedSeatsDetails] = useState([]);
  // storing available seat details
  const [availableSeatIds, setAvailableSeatIds] = useState([]);
  // storing reserved seat details
  const [reservedSeats, setReservedSeats] = useState([]);
  // storing reserved seat details of projects
  const [reservedProjectSeats, setReservedProjectSeats] = useState([]);
  // storing prefered seat details - state storing teammates information
  const [preferedSeatDetails, setPreferedSeatDetails] = useState([]);

  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [toasterHeading, setToasterHeading] = useState("");
  const [toasterMessage, setToasterMessage] = useState("");

  // state to store selected seat data - if seat is booked or reserved
  const [selectedUser, setSelectedUser] = useState({
    employeeId: 0,
    employeeName: "",
  });


  // function to handle close button click event
  const handleCloseMap = () => {
    setMapVisibility(false);
  };

  // function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // verify is admin trying to access the data of user and provide the functionality accordingly
    if (isAdmin) {
      try {
        axios
          .get("http://localhost:9006/bookmyseat/admin/seatrestriction/3")
          .then((res) => {
            const data = res.data;
            // console.log(data);

            // extract reserved seat data from the response received
            data.forEach((seat) => {
              if (seat.restrictedSeat === null) {
                setAvailableSeatIds((prevState) => [
                  ...prevState,
                  { id: seat.id },
                ]);
              } else if (seat.restrictedSeat.project === null) {
                setReservedSeats((prevState) => [
                  ...prevState,
                  {
                    id: seat.id,
                    seatNumber: seat.seatNumber,
                    floor: seat.floor.floorName,
                    employeeId: seat.restrictedSeat.user.employeeId,
                    employeeName: seat.restrictedSeat.user.firstName,
                  },
                ]);
              } else {
                setReservedProjectSeats((prevState) => [
                  ...prevState,
                  {
                    id: seat.id,
                    seatNumber: seat.seatNumber,
                    projectId: seat.restrictedSeat.project.id,
                    projectName: seat.restrictedSeat.project.projectName,
                  },
                ]);
              }
            });
          })
          .catch((err) => {
            // console.log(err);
            setToasterHeading("Error");
            setToasterMessage("Something went wrong. Please try again.");
            setShowToaster(true);
          });
      } catch (err) {
        setToasterHeading("Error");
        setToasterMessage("Something went wrong. Please try again.");
        setShowToaster(true);
      }
    } else {
      try {
        axios
          .post("http://localhost:9006/bookmyseat/user/floors", mapData)
          .then((res) => {
            const data = res.data;
            // console.log("data", res);

            // extracting reserved seats details
            data.availableSeats.forEach((seat) => {
              if (seat.restrictedSeat === null) {
                setAvailableSeatIds((prevState) => [
                  ...prevState,
                  { id: seat.id },
                ]);
              } else if (seat.restrictedSeat.project === null) {
                setReservedSeats((prevState) => [
                  ...prevState,
                  {
                    id: seat.id,
                    seatNumber: seat.seatNumber,
                    floor: seat.floor.floorName,
                    employeeId: seat.restrictedSeat.user.employeeId,
                    employeeName: seat.restrictedSeat.user.firstName,
                  },
                ]);
              } else {
                setReservedProjectSeats((prevState) => [
                  ...prevState,
                  {
                    id: seat.id,
                    seatNumber: seat.seatNumber,
                    projectId: seat.restrictedSeat.project.id,
                    projectName: seat.restrictedSeat.project.projectName,
                  },
                ]);
              }
            });

            // extracting booked seat data
            data.bookedSeats.map((item) => {
              setBookedSeatsDetails((prevState) => [
                ...prevState,
                {
                  seatId: item.seat.id,
                  employeeId: item.user.employeeId,
                  employeeName: item.user.firstName,
                },
              ]);
            });

            // extracting preferences details
            data.preferredSeats.map((item) => {
              setPreferedSeatDetails((prevState) => [
                ...prevState,
                {
                  seatId: item.seat.id,
                  employeeId: item.user.employeeId,
                  employeeName: item.user.firstName,
                },
              ]);
            });
          })
          .catch((err) => {
            setToasterHeading("Error");
            setToasterMessage("Something went wrong. Please try again.");
            setShowToaster(true);
          });
      } catch (err) {
        setToasterHeading("Error");
        setToasterMessage("Something went wrong. Please try again.");
        setShowToaster(true);
      }
    }
  }, [mapData]);
  // handling user click event on any seat
  const handleSeatClick = (seatNumber, seatIdCount) => {
    // extracting reserved seat
    const reservedSeat = reservedSeats.find(
      (seat) => seat.seatNumber === seatNumber
    );
    // extracting project reserved seat
    const reservedProjectSeat = reservedProjectSeats.find(
      (seat) => seat.seatNumber === seatNumber
    );
    // extracting booked seat
    const bookedSeat = bookedSeatsDetails.find(
      (seat) => seat.seatId === seatIdCount
    );

    // extracting prefered seat
    const preferedSeat = preferedSeatDetails.find(
      (seat) => seat.seatId === seatIdCount
    );

    // check if user is admin or not and then display messages accordingly
    if (!isAdmin && bookedSeat) {
      setModalHeading("Booked Seat!");
      setModalMessage("Seat is already booked by");
      setShowModal(true);
      setSelectedUser({
        employeeId: bookedSeat.employeeId,
        employeeName: bookedSeat.employeeName,
      });
      return;
    }

    if (!isAdmin && preferedSeat) {
      setModalHeading("Prefered Seat!");
      setModalMessage("Your TeamMate sits here!");
      setShowModal(true);
      setSelectedUser({
        employeeId: preferedSeat.employeeId,
        employeeName: preferedSeat.employeeName,
      });
      return;
    }

    if (reservedSeat) {
      setModalHeading("Reserved Seat!");
      setModalMessage("Seat is Reserved for");
      setShowModal(true);
      setSelectedUser({
        employeeId: reservedSeat.employeeId,
        employeeName: reservedSeat.employeeName,
      });
      return;
    }
    if (reservedProjectSeat) {
      if (
        !isAdmin &&
        userInformation.userProjectId === reservedProjectSeat.projectId
      ) {
        //allow him to select seat
      } else {
        // toast message here
        setToasterHeading("Project Reserved Seat!");
        setToasterMessage(
          "Seat is Reserved for project " + reservedProjectSeat.projectName
        );
        setShowToaster(true);
        return;
      }
    }
    setSelectedSeat((prevSeat) =>
      prevSeat === seatNumber ? null : seatNumber
    );
    onSeatSelect({ seatNumber, seatId: seatIdCount });
    setMapContent(null);
  };
  // function to render seats
  const renderSeats = (count) => {
    // array of count received
    const seats = Array.from({ length: count }, (_, index) => {
      const seatNumber = totalSeatCount + index;
      const currentSeatId = seatIdCount + seatNumber;
      const isSelected = selectedSeat === seatNumber;

      // seat id extraction for booked seats
      const bookedSeatIds = bookedSeatsDetails.map((item) => item.seatId);
      const isBooked = bookedSeatIds.includes(currentSeatId);

      // seat id extraction for reserved seats
      const reservedSeatIds = reservedSeats.map((item) => item.id);
      const reserve = reservedSeatIds.includes(currentSeatId);

      // seat id extraction for reserved seats
      const reservedProjectSeatIds = reservedProjectSeats.map(
        (item) => item.id
      );
      const reserveProject = reservedProjectSeatIds.includes(currentSeatId);

      // seat id extraction for preferences
      const preferedSeatIds = preferedSeatDetails.map((item) => item.seatId);
      const isPreferred = preferedSeatIds.includes(currentSeatId);

      // set color of seats based on seat status
      let seatColor = "lightgreen"; //empty seats
      if (isPreferred && isBooked) {
        seatColor = "#3a86ff"; //preferenced seats
      } else if (isSelected) {
        seatColor = "#faf0ca"; //selected seat
      } else if (isBooked) {
        seatColor = "red"; // booked seats
      } else if (reserve) {
        seatColor = "black"; // reserved seats
      } else if (reserveProject) {
        seatColor = "#489fb5"; //reserved project seat
      }
      return (
        <div
          key={`seat-${currentSeatId}`}
          onClick={() => handleSeatClick(seatNumber, currentSeatId)}
          className={`${styles.deskContainer}`}
        >
          <div className={styles.desk}>
            <p className={styles.seatNumber}>{seatNumber}</p>
            <Laptop2
              style={{ fill: seatColor }}
              className={styles.tablet}
              size={25}
            />
            {/* <Laptop size={15} style={{ fill: seatColor }} className={styles.chair} /> */}
          </div>
        </div>
      );
    });
    totalSeatCount += count;
    return seats;
  };
  return (
    <div className={styles.modalContainer}>
      {/* // main map container */}
      <div className={styles.firstFloorMainContainer}>
        <h1>First Floor</h1>
        <button onClick={handleCloseMap}>Close Map</button>
        <div className={styles.mapping}>
          <div className={styles.seatMappingContainer}>
            <Laptop2
              style={{ fill: "lightgreen" }}
              className={styles.tablet}
              size={25}
            />{" "}
            Available Seat
          </div>
          <div className={styles.seatMappingContainer}>
            <Laptop2
              style={{ fill: "red" }}
              className={styles.tablet}
              size={25}
            />{" "}
            Booked Seat
          </div>
          <div className={styles.seatMappingContainer}>
            <Laptop2
              style={{ fill: "#3a86ff" }}
              className={styles.tablet}
              size={25}
            />{" "}
            Team Mates
          </div>
          <div className={styles.seatMappingContainer}>
            <Laptop2
              style={{ fill: "black" }}
              className={styles.tablet}
              size={25}
            />{" "}
            Reserved Seat
          </div>
          <div className={styles.seatMappingContainer}>
            <Laptop2
              style={{ fill: "#489fb5" }}
              className={styles.tablet}
              size={25}
            />{" "}
            Project Reserved Seat
          </div>
        </div>
        {/* container without heading */}
        <div className={styles.mapContainer}>
          {/* container 1 - first element of main map grid */}
          <div className={` ${styles.container1}`}>
            <div className={styles.rooms}>Server Room</div>
          </div>
          {/* container 2 - second element of main map grid */}
          <div className={` ${styles.container2}`}>
            <div className={styles.rooms}>
              <p>SVP Room</p>
            </div>
            <div className={styles.rooms}>
              {renderSeats(1)}
              <p>Visitors Lounge </p>
            </div>
            <div className={styles.rooms}>{renderSeats(1)}M D</div>
            <div className={styles.rooms}>
              {renderSeats(1)}
              <p>Discussion Room </p>
            </div>
            <div className={styles.rooms}>{renderSeats(4)}</div>
          </div>
          {/* container 3 - third element of main map grid */}
          <div className={` ${styles.container3}`}>
            <div className={styles.rooms}>Emergency Exit</div>
          </div>
          {/* container 4 - Fourth element of main map grid */}
          <div className={` ${styles.container4}`}>
            <div className={styles.rooms}>Test lab</div>
            <div className={styles.rooms}>Conference Room</div>
            <div className={styles.rooms}>Enterance</div>
            <div className={styles.rooms}>Break out</div>
          </div>
          {/* container 5 - Fifth element of main map grid */}
          <div className={` ${styles.container5}`}>
            <div className={styles.gap1}></div>
            <div className={styles.gap1}></div>
            <div className={styles.gap1}></div>
            {renderSeats(46)}
            <div className={styles.gap1}></div>
            {renderSeats(46)}
            <div className={styles.gap1}></div>
            <div className={styles.gap1}></div>
            {renderSeats(23)}
          </div>
          {/* container 6 - sixth element of main map grid */}
          <div className={` ${styles.container6}`}>
            <div className={styles.rooms}> Stairs and Lift</div>
            <div className={styles.rooms}>AHU Room</div>
            <div className={styles.rooms}>Discussion Room</div>
            <div className={styles.rooms}>{renderSeats(1)}</div>
          </div>
        </div>
        {showModal && (
          <ResponseModal
            message={modalMessage}
            onClose={closeModal}
            heading={modalHeading}
            selectedUserData={selectedUser}
          />
        )}
        {showToaster && (
          <Toaster
            message={modalMessage}
            setShowToaster={setShowToaster}
            heading={modalHeading}
          />
        )}
      </div>
    </div>
  );
};
