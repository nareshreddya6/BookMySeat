import React, { useEffect, useState } from "react";
import styles from "../../markAttendance/styles/markAttendance.module.css";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";

const AttendeeList = () => {
  // Current Date
  const todayDate = new Date().toDateString();

  // Required States
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeBookings, setEmployeeBookings] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  // Function to get Data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Setting axios header for authorization
        const token = sessionStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;

        // Axios request to get data from server
        const response = await axios.get(
          "http://localhost:9006/bookmyseat/attendancemarked"
        );
        // Filtering useful Data from the axios response
        const filteredData = response.data.map((booking) => ({
          employeeId: booking.booking.user.employeeId,
          firstName: booking.booking.user.firstName,
          lastName: booking.booking.user.lastName,
          seatNumber: booking.booking.seat.seatNumber,
          floorName: booking.booking.seat.floor.floorName,
        }));
        // Setting filtered data to employeeBookings
        setEmployeeBookings(filteredData);
      } catch (error) {
        setModalHeading("Error");
        setModalMessage(
          "Something went wrong while fetching Data. Please try again."
        );
        setShowToaster(true);
      }
    };
    fetchData();
  }, []);

  // Function to filter attendees based on search query
  const filteredBookings = employeeBookings.filter((booking) => {
    return booking.employeeId.toString().includes(searchQuery.toString());
  });

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
        {/* Total number of attendees */}
        <p>Total Attendees: {filteredBookings.length}</p>

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
      <table className={styles.attendeeList}>
        {/* Table column headings */}
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Floor Name</th>
            <th>Seat Number</th>
            <th>Status</th>
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
              {/* Status */}
              <td>Attended</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Section */}
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

      {/* Conditional Rendering for toaster Comp */}
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

export default AttendeeList;
