import React, { useState } from "react";
import styles from "../../locationComp/styles/addNewInfo.module.css";
import EditHoliday from "./editHoliday.component";
import { ArrowUpRightFromSquare } from "lucide-react";
import Toaster from "../../../../toaster/components/toaster.component";

const AdminHolidays = ({ holidays, setUpdateHoliday }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEdit, setShowEdit] = useState(false);
  const [editHolidayData, setEditHolidayData] = useState(null);
  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

  const handleEditClick = (holiday_id, holidayDate) => {
    const currentDate = new Date();
    const selectedHolidayDate = new Date(holidayDate);
    console.log(holiday_id);

    // Check if the holiday date is in the future
    if (selectedHolidayDate > currentDate) {
      const selectedHoliday = holidays.find(
        (holiday) => holiday.id === holiday_id
      );
      setEditHolidayData(selectedHoliday);
      setShowEdit(true);
    } else {
      // alert("You can only modify holidays with future dates.");
      setModalHeading("Error");
      setModalMessage("You can only modify holidays with future dates.");
      setShowToaster(true);
    }
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.viewName}>
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
        <table>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Occasion</th>
              <th>Date</th>
              {/* <th>Modify</th> */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((holiday, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{holiday.holidayName}</td>
                <td>{holiday.holidayDate}</td>
                {/* <td>
                  <span
                    onClick={() =>
                      handleEditClick(holiday.id, holiday.holidayDate)
                    }
                  >
                    Edit <ArrowUpRightFromSquare color="green" />
                  </span>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {showEdit && (
        <EditHoliday holiday={editHolidayData} setShowEdit={setShowEdit} setUpdateHoliday={setUpdateHoliday}/>
      )}

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

export default AdminHolidays;
