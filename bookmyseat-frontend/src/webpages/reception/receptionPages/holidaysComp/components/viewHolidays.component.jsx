import React, { useEffect, useState } from "react";
import styles from "../styles/viewHolidays.module.css";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";

const ReceptionHolidays = () => {
  // States needed in the component
  const [holidays, setHolidays] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  // Function to get and store floors details from server
  useEffect(() => {
    const fetchData = () => {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get("http://localhost:9006/bookmyseat/getFutureHolidays")
        .then((response) => {
          // console.log("response Data", response.data);
          setHolidays(response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage(
            "Something went wrong while fetching holidays. Please try again."
          );
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // Function to filter and sort holidays based on the search query and date
  const filteredAndSortedHolidays = holidays
    .filter((holiday) => {
      return holiday.holidayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.holidayDate);
      const dateB = new Date(b.holidayDate);
      return dateA - dateB;
    });

  // Pagination Process
  const totalPages = Math.ceil(filteredAndSortedHolidays.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedHolidays
    ? filteredAndSortedHolidays.slice(indexOfFirstItem, indexOfLastItem)
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
  }, [filteredAndSortedHolidays, itemsPerPage, currentPage, totalPages]);

  useEffect(() => {
    // Ensure currentPage is set to 1 when searchQuery changes
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    // JSX Code
    <div className={styles.holidayViewContainer}>
      <div className={styles.holidayViewName}>
        {/* Input for search query */}
        <div className={styles.searchInput}>
          <p>Total Holidays: {filteredAndSortedHolidays.length}</p>
          <p>Holidays List</p>
          <input
            type="text"
            id="holidayname"
            name="holidayname"
            placeholder="Holiday to search"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Displaying Data in tabular form */}
        <table>
          {/* Table column headings */}
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Occassion</th>
              <th>Date</th>
            </tr>
          </thead>

          {/* Table body content */}
          <tbody>
            {currentItems.map((holiday, index) => (
              <tr key={index}>
                {/* Serial Number */}
                <td>{index + 1}</td>

                {/* Holiday Name */}
                <td>{holiday.holidayName}</td>

                {/* Holiday City */}
                <td>{holiday.holidayDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Process */}
      <div className={styles.pagination}>
        {filteredAndSortedHolidays.length > itemsPerPage && (
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

      {/* COnditional Rendering for Toaster */}
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

export default ReceptionHolidays;
