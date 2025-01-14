import React, { useEffect, useState } from "react";
import styles from "../../locationComp/styles/addNewInfo.module.css";
import EditProject from "./editProject.component";
import { ArrowUpRightFromSquare } from "lucide-react";

const ViewProjectTable = ({ projects, setCount }) => {
  // Ṣtates used in code
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEdit, setShowEdit] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);

  // Function to filter projects based on the input
  const filteredProjects = projects.filter((project) => {
    return project.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Pagination Process
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects
    ? filteredProjects.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Function to set page as current Page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to set current Page for pagination
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredProjects, itemsPerPage, currentPage, totalPages]);

  // Function to ensure currentPage is set to 1 when searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleEditClick = (project) => {
    setEditProjectData(project);
    setShowEdit(true);
  };

  return (
    // JSX Code
    <div className={styles.viewContainer}>
      <div className={styles.viewName}>
        {/* Input for search query */}
        <div className={styles.searchInput}>
          <p>Total Projects: {filteredProjects.length}</p>
          <input
            type="text"
            id="projectName"
            name="projectName"
            placeholder="Project to search"
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
              <th>Project Name</th>
              <th>Start Date</th>
              <th>Modify</th>
            </tr>
          </thead>

          {/* Table body content */}
          <tbody>
            {currentItems.map((project, index) => (
              <tr key={index}>
                {/* Serial Number */}
                <td>{project.id}</td>

                {/* project Name */}
                <td>{project.name}</td>

                <td>
                  {/* project startDate */}
                  {project.startDate}
                </td>
                <td>
                  <span onClick={() => handleEditClick(project)}>
                    Edit <ArrowUpRightFromSquare color="green" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Section */}
      <div className={styles.pagination}>
        {filteredProjects.length > itemsPerPage && (
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
        <EditProject project={editProjectData} setShowEdit={setShowEdit} setCount={setCount}/>
      )}
    </div>
  );
};

export default ViewProjectTable;
