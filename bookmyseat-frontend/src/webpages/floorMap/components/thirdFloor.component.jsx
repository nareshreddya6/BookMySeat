import { useEffect, useState } from "react";
import styles from "../styles/thirdFloor.module.css";
import axios from "axios";
import { Laptop2 } from "lucide-react";
import ResponseModal from "../../messageModal/responseModal";
import Toaster from "../../toaster/components/toaster.component";

export const ThirdFloorMap = ({
  onSeatSelect,
  setMapContent,
  isAdmin,
  mapData,
  userInformation,
  setMapVisibility,
}) => {
  // seat Id count to start from
  let seatIdCount = 413;
  // seat number Count to start from
  let totalSeatCount = 1;
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
  // storing prefered seat details - state storing teammates informationconsole
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

  // function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // function to handle close button click event
  const handleCloseMap = () => {
    setMapVisibility(false);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // verify is admin trying to access the data of user and provide the functionality accordingly
    if (isAdmin) {
      try {
        axios
          .get("http://localhost:9006/bookmyseat/admin/seatrestriction/5")
          .then((res) => {
            const data = res.data;

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
            setModalMessage("Something went wrong. Please try again.");
            setShowModal(true);
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
        // alert("allow him to reserve here");
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
    <>
      <div className={styles.modalContainer}>
        <div className={styles.thirdFloor}>
          <h1 className={styles.heading}>Third Floor</h1>
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
          <div className={styles.mapContainer}>
            <div className={styles.container1}>
              <div>Store</div>
              <div>Lift and Stairs</div>
              <div>Lobby & Enterance</div>
              <div>Off limit</div>
            </div>
            <div className={styles.container2}>
              <div>Server Room</div>
              <div>
                Discussion Room
                {renderSeats(1)}
              </div>
              <div>Discussion Room</div>
              <div>Discussion Room</div>
              <div></div>
              <div>Play Area</div>
            </div>
            <div className={styles.container3}>{renderSeats(10)}</div>
            <div className={styles.container4}>
              {renderSeats(3)}
              <div>Emergency Exit</div>
              {renderSeats(3)}
              <div>
                <div>Lift</div>
                <div></div>
              </div>
            </div>
            <div className={styles.container5}>
              <div></div>
              {renderSeats(12)}
            </div>
            <div className={styles.container6}>
              <div></div>
              {renderSeats(3)}
              <div>
                <div>LOIUS VUITTON Holding</div>
                <div>
                  <div>
                    <p style={{ fontSize: "12px" }}>Discussion Room</p>
                  </div>
                  <div>Lab</div>
                </div>
              </div>
              <div>
                <div>Stairs</div>
                <div>Store</div>
              </div>
              {renderSeats(12)}
            </div>
            <div className={styles.container7}>
              <div></div>
              {renderSeats(10)}
            </div>
            <div className={styles.container8}>
              <div></div>
              <div></div>
              {renderSeats(40)}
            </div>
          </div>
          <div className={styles.circularConderenceRoom}>
            <img src="/assets/Images/LVConferenceRoom.jpg" alt="" />
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
    </>
  );
};
