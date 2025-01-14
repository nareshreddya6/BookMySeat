import React, { useEffect, useState } from "react";
import styles from "../styles/markAttendance.module.css";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";

const MarkAttendance = () => {
  // today date
  const todayDate = new Date().toDateString();

  // States needed
  const [searchQuery, setSearchQuery] = useState("");
  const [otpMap, setOtpMap] = useState({});
  const [employeeBookings, setEmployeeBookings] = useState([]);
  let [count, setCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  // useEffect to fetch list of attendees from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adding header for authorization
        const token = sessionStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        // console.log(token);

        //storing response from the axios request
        const response = await axios.get(
          "http://localhost:9006/bookmyseat/markattendance"
        );

        // filterting useful data from the received response
        const filteredData = response.data.map((booking) => ({
          employeeId: booking.booking.user.employeeId,
          firstName: booking.booking.user.firstName,
          lastName: booking.booking.user.lastName,
          seatNumber: booking.booking.seat.seatNumber,
          floorName: booking.booking.seat.floor.floorName,
          otp: booking.booking.verificationCode,
        }));

        // setting filtered data to employeeBookings
        setEmployeeBookings(filteredData);
        // console.log(response.data);

        // console.log(response.data.seat.id);
        // console.log(response.data.seat.seatNumber);
        // console.log(response.data.seat.floor.floorName);
      } catch (error) {
        setModalHeading("Error");
        setModalMessage(
          "Something while fetching User Data. Please try again."
        );
        setShowToaster(true);
      }
    };
    fetchData();
  }, [count]);

  // Filtering bookings based on the search input
  const filteredBookings = employeeBookings.filter((booking) => {
    return booking.employeeId.toString().includes(searchQuery.toString());
  });

  // Handle click on mark attendance button
  const handleAttendance = (empId) => {
    // console.log("EmployeeBookingData: ", employeeBookings);
    const enteredOTP = parseInt(otpMap[empId]);
    const booking = employeeBookings.find(
      (booking) => booking.employeeId === empId
    );
    const backendOTP = parseInt(booking ? booking.otp : null);
    console.log("Selected EMployee: ", enteredOTP);
    console.log("Backend OTP: ", backendOTP);

    // If entered OTP matches backend OTP, proceed to mark attendance
    if (backendOTP === enteredOTP) {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      // console.log(token);

      // Sending employee Id to server after successfully marking employee attendance
      axios
        .put("http://localhost:9006/bookmyseat/markattendance", {
          employeeId: empId,
        })
        .then((response) => {
          setCount((prevCount) => prevCount + 1);
          setModalHeading("Success");
          setModalMessage(response.data);
          setShowToaster(true);
        })
        .catch((error) => {
          // console.error(error);
          setModalHeading("Error");
          setModalMessage(error.response.data);
          setShowToaster(true);
          setShowToaster(true);
        });
    }
    //If OTP not entered
    else if (!enteredOTP) {
      setModalHeading("Incomplete data");
      setModalMessage("Enter OTP first.");
      setShowToaster(true);
    }
    // If OTPs are not matching
    else {
      setModalHeading("Data Doesn't Match");
      setModalMessage("Entered OTP is not Valid.");
      setShowToaster(true);
    }
  };

  // Pagination Process
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings
    ? filteredBookings.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredBookings, itemsPerPage, currentPage, totalPages]);

  useEffect(() => {
    // Ensure currentPage is set to 1 when searchQuery changes
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className={styles.markAttendanceDetails}>
      {/* Header for Page */}
      <div className={styles.attendanceHeader}>
        {/* Total number of employee in wait list */}
        <p>Total In-Waiting: {filteredBookings.length}</p>

        {/* Current Date */}
        <p>{todayDate}</p>

        {/* Input for search query */}
        <input
          type="number"
          id="employeeId"
          name="employeeId"
          placeholder="Employee ID to search"
          autoComplete="off"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={5}
          value={searchQuery}
          onChange={(e) => {
            const maxLength = 5;
            const inputQuery = e.target.value;
            if (inputQuery.length <= maxLength) {
              setSearchQuery(inputQuery);
            }
          }}
        />
      </div>

      {/* Displaying Data in tabular form */}
      <table>
        {/* Table column headings */}
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Floor Name</th>
            <th>Seat Number</th>
            <th>Verify Code</th>
            <th>Mark Attendance</th>
          </tr>
        </thead>

        {/* Table body content */}
        <tbody>
          {currentItems.map((booking, index) => (
            <tr key={index}>
              {/* Employee ID */}
              <td>{booking.employeeId}</td>
              {/* Employee Name */}
              <td>
                {booking.firstName} {booking.lastName}
              </td>
              {/* Floor Name */}
              <td>{booking.floorName}</td>
              {/* Seat Number */}
              <td>{booking.seatNumber}</td>
              <td>
                {/* Input to store OTP provided to employee */}
                <input
                  type="number"
                  id={`otp_${booking.employeeId}`}
                  name={`otp_${booking.employeeId}`}
                  placeholder="Code"
                  autoComplete="off"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={otpMap[booking.employeeId] || ""}
                  onChange={(e) => {
                    const maxLength = 6;
                    const inputQuery = e.target.value;
                    if (inputQuery.length <= maxLength) {
                      setOtpMap((prevState) => ({
                        ...prevState,
                        [booking.employeeId]: inputQuery,
                      }));
                    }
                  }}
                />
              </td>
              <td>
                {/* Button to mark attendance */}
                <button
                  className={styles.markAttendance}
                  onClick={() => handleAttendance(booking.employeeId)}
                >
                  Mark Attendance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Comp */}
      <div className={styles.pagination}>
        {filteredBookings.length > itemsPerPage && (
          <>
            {currentPage > 1 && (
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage - 1)}
              >
                &lt;
              </button>
            )}
            {[currentPage - 1, currentPage, currentPage + 1].map((page) => {
              if (page > 0 && page <= totalPages) {
                return (
                  <button
                    key={page}
                    className={`${styles.paginationButton} ${
                      currentPage === page ? styles.activePage : ""
                    }`}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}
            {currentPage < totalPages && (
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage + 1)}
              >
                &gt;
              </button>
            )}
          </>
        )}
      </div>

      {/* Conditional Rendering of Toaster Comp */}
      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </div>
  );
};

export default MarkAttendance;
