import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/dashboard.module.css";
import { faCouch, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditBooking from "../../seatBooking/components/editBookingForm.component";
import Toaster from "../../../../toaster/components/toaster.component";

export default function DashBoard({ setUserInformation }) {
  const [showModal, setShowModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [data, setData] = useState([]);
  const [approvals, setApprovals] = useState(0);
  const [editingBookingId, setEditingBookingId] = useState(0);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  // const [percentage, setPercentage] = useState(0);
  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [showCode, setShowCode] = useState(
    new Array(data?.bookings?.length).fill(false)
  );
  // const [isFlipped, setIsFlipped] = useState(
  //   Array(data?.bookings?.length).fill(false)
  // );
  const options = { year: "numeric", month: "long", day: "numeric" };
  // const { day, month, year } = options;
  const today = new Date().toLocaleDateString("en-US", options);
  const date = new Date();
  const hours = date.getHours();
  let greeting;
  if (hours < 12) {
    greeting = "Good morning";
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  const monthName = today.split(" ")[0];

  const toggleCode = (bookingId) => {
    setShowCode((prevState) => ({
      ...prevState,
      [bookingId]: !prevState[bookingId],
    }));
  };

  const handleEditClick = (bookingId) => {
    setEditingBookingId(bookingId);
    // console.log("Booking id from dashboard", bookingId);
    setShowEditForm(true); // Show the edit form
  };

  // Function to handle click on cancel button in edit form
  const handleCancelEdit = () => {
    setShowEditForm(false); // Hide the edit form
  };

  //fetching user details from backend through the api used in axios
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("http://localhost:9006/bookmyseat/user/dashboard")
      .then((res) => {
        setData(res.data);
        const data = res.data.user;
        console.log("User DashBoard: ", res.data);
        setUserInformation(() => ({
          userId: data.id,
          userEmployeeId: data.employeeId,
          userRole: data.role.roleName,
          userProjectId: data.project.id,
          userProject: data.project.projectName,
        }));
        // console.log("user detail", data);
        setApprovals(res.data.bookings.length);
        setShowBookingDetails(res.data.bookings.length > 0);
      })
      .catch((err) => console.log(err));
  }, []);

  //if approvals is > 0 then showBookingDetails
  useEffect(() => {
    if (approvals > 0) {
      setShowBookingDetails(true);
    }
  }, [approvals]);

  const openModal = (bookingId) => {
    // Set the booking ID to be deleted and open the modal
    setBookingToDelete(bookingId);
    setShowModal(true);
  };

  const closeModal = () => {
    // Close the modal without performing any action
    setShowModal(false);
    setBookingToDelete(null);
  };

  const handleDelete = (bookingId) => {
    const updatedData = data.bookings.filter(
      (booking) => booking.bookingId !== bookingId
    );
    setData(updatedData);
    setApprovals(updatedData.length); // Update approvals count based on the updated data length
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put(`http://localhost:9006/bookmyseat/user/cancel/${bookingId}`)
      .then((response) => {
        // console.log(response.data);
        setShowModal(false);
        setBookingToDelete(null);
        setModalHeading("Success");
        setModalMessage(response.data);
        setShowToaster(true);
        const token = sessionStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        axios
          .get("http://localhost:9006/bookmyseat/user/dashboard")
          .then((res) => {
            setData(res.data);
            setApprovals(res.data.bookings.length);
            setShowBookingDetails(res.data.bookings.length > 0);
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error("Error cancelling booking:", error);
        setModalHeading("Error");
        setModalMessage(error.response.data);
        setShowToaster(true);
      });
  };

  return (
    <>
      {showEditForm ? (
        // Render the edit form
        <EditBooking
          bookingId={editingBookingId}
          handleCancelEdit={handleCancelEdit}
        />
      ) : (
        //main container for dashboard
        <div className={styles.DashBoard}>
          <div className={styles.greetingmessage}>
            <p>
              {greeting}, {data?.user?.firstName || "Guest"}!
            </p>
          </div>
          <div className={styles.submessage}>
            <p>Today, {today} </p>
          </div>
          <div className={styles.content}>
            <div className={styles.status}>
              <div className={styles.inner}>
                <div className={styles.text}> Attendance in {monthName} </div>
                <div className={styles.attendancecontainer}>
                  <p className={styles.attendance}>{data.attendanceCount}</p>
                </div>
              </div>
            </div>
            <div className={styles.status}>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/002/743/514/small_2x/green-check-mark-icon-in-a-circle-free-vector.jpg"
                alt="logo"
                width="50px"
                height="50px"
              />
              <div className={styles.innercontent}>
                <p>Approved</p>
                <p className={styles.one}>{data?.bookings?.length || "0"}</p>
              </div>
            </div>
          </div>
          {data?.bookings?.length > 0 && (
            <div className={styles.cardComp}>
              {showBookingDetails &&
                data.bookings.map((booking, index) => (
                  <div key={index} className={styles.bookingdetails}>
                    <div className={`${styles.front} ${styles.couchAndDetail}`}>
                      <div className={styles.bookingInfo}>
                        <FontAwesomeIcon
                          className={styles.seat}
                          icon={faCouch}
                        />
                        <div className={styles.bookingdata}>
                          <p>
                            Date :{" "}
                            <strong>
                              {booking.startDate
                                ? `${booking.startDate} to ${booking.endDate}`
                                : " "}
                            </strong>
                          </p>
                          <p>
                            Seat Number:{" "}
                            <strong>{booking.seatNumber || " "}</strong>
                          </p>
                          <p>
                            Floor: <strong>{booking.floorName || " "}</strong>
                          </p>
                          <p>
                            Shift Time:{" "}
                            <strong>
                              {booking.startTime
                                ? `${booking.startTime} to ${booking.endTime}`
                                : " "}
                            </strong>
                          </p>
                        </div>
                      </div>
                      <div className={styles.cancelcontainer}>
                        {!showCode[booking.bookingId] && (
                          <div className={styles.verification}>
                             <p
                            className={styles.code}
                            onClick={() => toggleCode(booking.bookingId)} 
                          >
                           Code&nbsp;<FontAwesomeIcon icon={faEyeSlash} fontSize={12} /> </p>
                         
                          </div>
                         
                        )}
                        {showCode[booking.bookingId] && (
                          <div
                            className={styles.codeBlock}
                            onClick={() => toggleCode(booking.bookingId)}
                          >
                            <p>{booking.verificationCode}</p>
                          </div>
                        )}
                        <button
                          className={styles.editbtn}
                          // onClick={() => handleNavigate(booking.id)}
                          onClick={() => handleEditClick(booking.bookingId)}
                        >
                          Edit
                        </button>
                        {booking.allowCancel && (
                          <button
                            className={styles.deletebtn}
                            onClick={() => openModal(booking.bookingId)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {data?.bookings?.length === 0 && !showBookingDetails && (
            <div className={styles.cardComp}>
              <div className={styles.bookingdetails}>
                <div className={styles.bookingInfo}>
                  <FontAwesomeIcon className={styles.seat} icon={faCouch} />
                  <div className={styles.warning}>
                    <p>No Booking Available Currently</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Booking Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div>
              <button
                className={styles.cancelB}
                onClick={() => handleDelete(bookingToDelete)}
              >
                Yes, Cancel
              </button>
              <button className={styles.keep} onClick={closeModal}>
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </>
  );
}
