import React, { useEffect, useState } from "react";
import styles from "../styles/editBooking.module.css";
import { faPenToSquare, faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GroundFloorMap } from "../../../../floorMap/components/groundFloorMap.component";
import { MezzanineFloor } from "../../../../floorMap/components/mezzanineFloorMap.component";
import { FirstFloor } from "../../../../floorMap/components/firstFloor.component";
import { SecondFloor } from "../../../../floorMap/components/secondFloor.component";
import { ThirdFloorMap } from "../../../../floorMap/components/thirdFloor.component";
import { TerraceTrainingRoom } from "../../../../floorMap/components/terraceTrainingRoom.module";
import { ChevronDown } from "lucide-react";
import UserInfo from "./userInfo.component";

export default function EditBooking({ userId }) {
  const [bookings, setBookings] = useState([]);
  const [count, setCount] = useState(0);
  const [showFrontPage, setShowFrontPage] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showBack, setShowBack] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [floors, setFloors] = useState([]);
  const [selectedFloorMap, setSelectedFloorMap] = useState(null);
  const [mapVisibility, setMapVisibility] = useState(false);
  const [mapContent, setMapContent] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [postData, setPostData] = useState();
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [editSeat, setEditSeat] = useState(0);

  useEffect(() => {
    const fetchDataAndUpdatePostData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(
          `http://localhost:9006/bookmyseat/admin/userBookings/${userId}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
      }
    };

    fetchDataAndUpdatePostData();

    // Include all relevant variables in the dependencies array
  }, [count, editSeat]);

  const openMap = (floorId) => {
    const content = getMapContent(floorId);
    setMapContent(content);
    setMapVisibility(true);
    setShowModal(false);
  };

  const togglePage = () => {
    setShowFrontPage(!showFrontPage);
  };

  useEffect(() => {
    // Update map content when postData changes
    setMapContent(getMapContent(selectedFloor));
  }, [postData]);
  

  const getMapContent = (floorId) => {
    switch (floorId) {
      case 1:
        return (
          <GroundFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={false}
            mapData={postData}
            setMapVisibility={setMapVisibility}
          />
        );
      case 2:
        return (
          <MezzanineFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={false}
            mapData={postData}
            setMapVisibility={setMapVisibility}
          />
        );
      case 3:
        return (
          <FirstFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={false}
            mapData={postData}
            setMapVisibility={setMapVisibility}
          />
        );
      case 4:
        return (
          <SecondFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={false}
            mapData={postData}
            setMapVisibility={setMapVisibility}
          />
        );
      case 5:
        return (
          <ThirdFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={false}
            mapData={postData}
            setMapVisibility={setMapVisibility}
          />
        );
      case 6:
        return (
          <TerraceTrainingRoom
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={false}
            mapData={postData}
            setMapVisibility={setMapVisibility}
          />
        );
      default:
        return null;
    }
  };

  const handleSeatSelection = ({ seatNumber, seatId }) => {
    setSelectedSeat(seatNumber);
    setSelectedSeatId(seatId);
    setShowModal(true);
  };

  const handleFloorNameClick = (floorId, bookingDetails) => {
    setSelectedFloor(floorId);
    setPostData((prevState) => ({ ...prevState, floorId: floorId }));
    setDropdownOpen(false);
    openMap(floorId);
    console.log("booking edit", floorId)
    setPostData((prevState) => ({ ...prevState, floorId: floorId }));
  };


  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    setPostData((prevState) => ({
      ...prevState,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));

    axios
      .get("http://localhost:9006/bookmyseat/admin/floors")
      .then((response) => {
        setFloors(response.data);
        // console.log("Floor data fetched successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching floor data:", error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filterDataByDateRange = () => {
    const filteredData = bookings?.filter((detail) => {
      const fromDate = new Date(detail.startDate);
      const toDate = new Date(detail.endDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) {
        return fromDate >= start && toDate <= end;
      } else if (start) {
        return fromDate >= start;
      } else if (end) {
        return toDate <= end;
      }
      return true;
    });
    return filteredData;
  };

  const handleSaveSeatNumber = () => {
    if (selectedSeatId && selectedBooking) {
      axios
        .post("http://localhost:9006/bookmyseat/admin/updateseat", {
          seatId: selectedSeatId,
          id: selectedBooking.id,
        })
        .then((response) => {
          setShowResponseModal(true);
          setModalMessage(response.data);
          setSelectedSeatId(null);
          setEditSeat((prevCount) => prevCount + 1);
        })
        .catch((error) => {
          console.error("Error saving seat number:", error);
          // Show error modal
          setShowResponseModal(true);
          setModalMessage("Error saving seat number. Please try again.");
        });
    } else {
      console.error("No seat selected.");
      setShowResponseModal(true);
      setModalMessage("No seat selected.");
    }
  };

  const handleResponseCloseModal = () => {
    setShowResponseModal(false);
    setShowModal(false);
  };

  // console.log("Aastha ", bookings);

  const handleBookingCancellation = (bookingId) => {
    // console.log("The id is ", bookingId);
    // Send the cancellation request to the backend
    axios
      .put(`http://localhost:9006/bookmyseat/admin/cancel/${bookingId}`)
      .then((response) => {
        setCount((prevCount) => prevCount + 1);
        setShowResponseModal(true);
        setModalMessage("Deleted Successfully.");
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
      });
  };

  return (
    <div>
      {showFrontPage ? (
        <UserInfo />
      ) : (
        <div className={styles.back}>
          {showBack && (
            <>
              <div className={styles.maindetail}>
                <div className={styles.bookingHeader}>
                  <label htmlFor="start-date">Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <label htmlFor="end-date">End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className={styles.btn}>
                  <button className={styles.togglebtn} onClick={togglePage}>
                    Back
                  </button>
                </div>
              </div>
              <div className={styles.bookingdetails}>
                <table className={styles.usertable}>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Booking Range</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Seat Number</th>
                      <th>Booking Status</th>
                      <th>Edit</th>
                      <th>Cancel</th>
                      {/* Add more table headers as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {filterDataByDateRange().map((booking, index) => (
                      <tr key={index}>
                        <td>{booking.id}</td>
                        <td>{booking.bookingRange}</td>
                        <td>{booking.startDate}</td>
                        <td>{booking.endDate}</td>
                        <td>{booking.seat.seatNumber}</td>
                        <td>
                          {booking.bookingStatus ? "ACTIVE" : "CANCELLED"}
                        </td>
                        <td>
                          {booking.bookingStatus ? (
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              fontSize={12}
                              color="green"
                              onClick={() => handleOpenModal(booking)}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              fontSize={12}
                              color="gray" // or any other color you prefer for disabled state
                              // Optionally, you can remove the onClick handler to prevent interaction
                            />
                          )}
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faBan}
                            fontSize={12}
                            color="red"
                            onClick={() =>
                              handleBookingCancellation(booking.id)
                            }
                          />
                        </td>
                        {/* Add more table cells as needed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {showModal && selectedBooking && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Modify Seat</h2>
                {/* Input field for floor name */}
                <div className={styles.rowContent}>
                  <div className={styles.customDropdown}>
                    <div
                      className={styles.selectedFloor}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      {selectedFloor
                        ? floors.find((floor) => floor.id === selectedFloor)
                            .floorName
                        : "Select Floor"}{" "}
                      <ChevronDown size={12} />
                    </div>
                    {dropdownOpen && (
                      <div className={styles.dropdownList}>
                        {floors.map((floor) => (
                          <div
                            key={floor.id}
                            className={styles.dropdownItem}
                            value={floor.name}
                            onClick={() => {
                              handleFloorNameClick(floor.id, bookings);
                            }}
                          >
                            {floor.floorName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.selectSeat}>
                    <div className={styles.seatNumber}>
                      <label className={styles.formLabel} htmlFor="seatNumber">
                        Selected Seat:
                      </label>
                      <input
                        className={styles.formInput}
                        type="text"
                        name="seatNumber"
                        id="seatNumber"
                        placeholder="Seat ID"
                        value={selectedSeat}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.btn}>
                  <button
                    className={styles.save}
                    onClick={handleSaveSeatNumber}
                  >
                    Save
                  </button>
                  <button className={styles.cancel} onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className={styles.mapModal}>{mapVisibility && mapContent}</div>

          {showResponseModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Response</h2>
                <p>{modalMessage}</p>
                <button
                  className={styles.cancel}
                  onClick={handleResponseCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
