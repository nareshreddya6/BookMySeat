import React, { useState } from "react";
import styles from "../styles/userList.module.css";
import paginationStyles from "../styles/pagination.module.css";

export default function UserList({
  filteredData,
  setSelectedUser,
  handleReserveSeat,
  setCurrentPage,
  currentPage,
}) {
  // defining total number of list items per page
  const [itemsPerPage] = useState(10);
  // calculating total number of pages required
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // maintaining indexs
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // items to display in current page
  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  // paginating between pages
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // storing the data of user when clicked
  const handleUserSelect = (data) => {
    setSelectedUser((prevState) => ({
      ...prevState,
      name: data.firstName + " " + data.lastName,
      email: data.email,
      employeeId: data.employeeId,
      userId: data.id,
    }));

    handleReserveSeat();
  };

  return (
    <div>
      {/* list containing details of all employees */}
      <div className={styles.userList}>
        <div className={styles.employeedetails}>
          <table className={styles.usertable}>
            {/* table heading */}
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* table body */}
            <tbody>
              {currentItems.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.employeeId}</td>
                  <td>{detail.firstName + " " + detail.lastName}</td>
                  <td>{detail.email}</td>
                  <td>
                    <button
                      onClick={() => handleUserSelect(detail)}
                      className={styles.reserveButton}
                    >
                      Reserve Seat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* pagination buttons container */}
      <div className={paginationStyles.pagination}>
        {filteredData.length > itemsPerPage && (
          <>
            {currentPage > 1 && (
              <button
                className={paginationStyles.paginationButton}
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
                    className={`${paginationStyles.paginationButton} ${
                      currentPage === page ? paginationStyles.activePage : ""
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
                className={paginationStyles.paginationButton}
                onClick={() => paginate(currentPage + 1)}
              >
                &gt;
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
