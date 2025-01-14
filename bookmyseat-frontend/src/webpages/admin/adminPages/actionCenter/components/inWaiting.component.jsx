import React, { useEffect, useState } from "react";
import styles from "../styles/actionCenter.module.css";

const WaitingTab = ({
  searchQuery,
  setSearchQuery,
  handleApprove,
  handleReject,
  pendingEmployees,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalPages = Math.ceil(pendingEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pendingEmployees
    ? pendingEmployees.slice(indexOfFirstItem, indexOfLastItem)
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
  }, [pendingEmployees, itemsPerPage, currentPage, totalPages]);

  useEffect(() => {
    // Ensure currentPage is set to 1 when searchQuery changes
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <div className={styles.inWaitingContainer}>
        <div className={styles.inWaitingName}>
          <div className={styles.searchInput}>
            {/* Total inwaiting till Date */}
            <p>Total In-Waiting: {pendingEmployees.length}</p>
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
                <th>Employee Mail</th>
                <th>Approve</th>
                <th>Reject</th>
              </tr>
            </thead>

            {/* Table body content */}
            <tbody>
              {currentItems.map((employee, index) => (
                <tr key={index}>
                  {/* EmployeeID */}
                  <td>{employee.employeeId}</td>

                  {/* Employee Name */}
                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>

                  {/* Employee email */}
                  <td>{employee.email}</td>

                  <td>
                    {/* Button to approve employee registration */}
                    <button
                      className={styles.approveBtn}
                      onClick={() => handleApprove(employee.email)}
                    >
                      Approve
                    </button>
                  </td>
                  <td>
                    {/* Button to reject employee registration */}
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleReject(employee.email)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          {pendingEmployees.length > itemsPerPage && (
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
      </div>
    </>
  );
};

export default WaitingTab;
