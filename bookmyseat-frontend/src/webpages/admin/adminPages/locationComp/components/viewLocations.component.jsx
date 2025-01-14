import React, { useEffect, useState } from "react";
import styles from "../styles/addNewInfo.module.css";

const ViewLocationTable = ({ locations }) => {
  // States used in code
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Function to filter locations based on the input
  const filteredLocations = locations.filter((location) => {
    return (
      location.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.locationName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination Process
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocations
    ? filteredLocations.slice(indexOfFirstItem, indexOfLastItem)
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
    }, [filteredLocations, itemsPerPage, currentPage, totalPages]);
  
    useEffect(() => {
      // Ensure currentPage is set to 1 when searchQuery changes
      setCurrentPage(1);
    }, [searchQuery]);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.viewName}>
        {/* Input for search query */}
        <div className={styles.searchInput}>
          <p>Total Locations: {filteredLocations.length}</p>
          <input
            type="text"
            id="locationname"
            name="locationname"
            placeholder="Location to search"
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
              <th>Location Name</th>
              <th>City</th>
            </tr>
          </thead>

          {/* Table body content */}
          <tbody>
            {currentItems.map((location, index) => (
              <tr key={index}>
                {/* Serial Number */}
                <td>{location.id}</td>

                {/* Location Name */}
                <td>{location.buildingName}</td>

                {/* Location City */}
                <td>{location.locationName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={styles.pagination}>
        {filteredLocations.length > itemsPerPage && (
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
  );
};

export default ViewLocationTable;
