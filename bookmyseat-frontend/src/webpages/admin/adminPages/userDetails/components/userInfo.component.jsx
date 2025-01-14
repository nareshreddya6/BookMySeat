import React from "react";
import {
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/userInfo.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditBooking from "./editBooking.component";
import CreateUser from "../../createUser/components/createUser.component";
import PrintOptions from "./printOptions.component";


const filterEmployeesBySearchQuery = (employees, searchQuery) => {
    return employees.filter((employee) =>
      employee.employeeId.toString().includes(searchQuery)
    );
  };
export default function UserInfo() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId , setUserId] = useState(0);
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [updatedProject, setUpdatedProject] = useState('');
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showFront, setShowFront] = useState(true);
    const [countProject, setCountProject] = useState(0);
const [prevPageOnSearch, setPrevPageOnSearch] = useState(1);
    const navigate = useNavigate();
  

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
      };

      
    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleViewDetails = (userId) => {
    setUserId(userId);
    setShowFront(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveProject = () => {
    if (!selectedUserId) {
      console.error("No user selected!");
      return;
    }

    const updatedData = {
      userId: selectedUserId,
      projectId: updatedProject,
    };

    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // console.log(token);

    axios
      .put("http://localhost:9006/bookmyseat/admin/updateUser", updatedData)
      .then((response) => {
        // console.log("Project updated successfully:", response.data);
        setCountProject((prevCount) => prevCount + 1);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Failed to update project:", error);
      });
  };

  // console.log("Project is", projects);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    try {
      axios
        .get("http://localhost:9006/bookmyseat/admin/users")
        .then((res) => {
          setUsers(res.data.users);
          console.log("users is", res.data.users)
          setProjects(res.data.projects);
        })
        .catch((err) => 
        console.log("not connected", err)
        );
    } catch (error) {
      console.error("Error fetching user Details: ", error);
    }
  }, [countProject]);

    const filteredUsers = filterEmployeesBySearchQuery(users, searchQuery);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => {
      if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
    
    useEffect(() => {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
 
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [filteredUsers, itemsPerPage]);
    
    useEffect(() => {
      const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
      // Ensure currentPage is set to 1 when searchQuery changes
      setCurrentPage(1);
    }, [searchQuery]);

 
    return(
        // <UserDetails/>
        <div>
            {showFront && (
                <div className={styles.front}>
                <div className={styles.iconContainer}>
                    <h2>EMPLOYEES LIST</h2>
                </div>
                <hr />
                <div className={styles.createUserPage}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        placeholder="Search by Employee ID"
                        className={styles.inputFieldForSearch}
                        />
                    <div className={styles.rightButton}>
                      <PrintOptions className={styles.export} users={users}/>
                      <button className={styles.createUserbtn} onClick={toggleForm}>
                          <FontAwesomeIcon icon={faPlus} fontSize={14} color="white"/> Create User
                      </button>
                    </div>
                </div>

                <div className={styles.employeedetails}>
                <table className={styles.usertable}>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Project</th>
                            <th>Email</th>
                            <th>Created Date</th>
                            <th>Bookings</th>
                        </tr>
                    </thead>
    
                    <tbody>
                    {currentItems.map((detail, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>
                                        {detail.employeeId} 
                                    </td>
                                    <td>
                                        {detail.firstName} 
                                    </td>
                                    <td>{detail.project.projectName}  <FontAwesomeIcon icon={faPenToSquare} fontSize={14} color='green' onClick={()=>{handleOpenModal();
                                    handleUserSelect(detail.id);
                                }}/></td>
                                    <td>{detail.email}</td>
                                    <td>{new Date(detail.createdDate).toISOString().split('T')[0]}</td>
    
                                    <td>
                                       <p className={styles.view} onClick={() => handleViewDetails(detail.id)}>View Details</p>
                                    </td>
    
                                </tr>
                                </React.Fragment>
                        ))}
                                </tbody>
                                </table>
                </div>
                <div className={styles.pagination}>
                {filteredUsers.length > itemsPerPage && (
                        <React.Fragment>
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
                                                className={`${styles.paginationButton} ${currentPage === page ? styles.active : ''}`}
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
                        </React.Fragment>
                    )}
                </div>
    
                {showModal && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <h2>Change Project</h2>
                                <select className={styles.selectoptions} value={updatedProject} onChange={(e) =>{ 
                                   const projectId = e.target.value;
                                    setUpdatedProject(projectId); }
                                    }>
                                        {projects.map((project) => (
                                            <option key={project.projectId} value={project.id}>
                                                {project.projectName}
                                            </option>
                                        ))}
                                </select>
                                <div className='btncontainer'>
                                    <button className={styles.savePhoneno} onClick={handleSaveProject}>Save</button>
                                    <button className={styles.cancelPhoneno} onClick={handleCloseModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            )}
            {!showFront && <EditBooking userId = {userId} />}
            {showForm && (
                <div className={styles.createUserFormContainer}>
                    <div className={styles.createUserForm}>
                    <CreateUser onClose={() => setShowForm(false)} />
                    </div>
                </div>
            )}
        </div>
        
    )
     
}
