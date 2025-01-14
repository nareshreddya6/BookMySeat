import React, { useEffect, useState } from "react";
import styles from "../styles/createUser.module.css";

import axios from "axios";

export default function CreateUser({ onClose }) {
  const [projects, setProjects] = useState([]);
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [responseMessage, setResponseMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    phoneNumber: "",
    workLocation: "Bengaluru", // Default value
    projectId: "",
  });

  const handleCloseResponseModal = () => {
    setResponseModalVisible(false);
  };

  useEffect(() => {
    // Fetch projects from the backend when the component mounts
    // Setting axios header for authorization
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("http://localhost:9006/bookmyseat/admin/projects")
      .then((res) => {
        // const projectNames = res.data.map(project => project.projectName);
        // console.log(res.data);
        setProjects(res.data);
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage("Something went wrong!. Please try again.");
        setShowToaster(true);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    const { firstName, lastName, email, employeeId, phoneNumber, projectId } = formData;

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !employeeId ||
      !phoneNumber ||
      !projectId ||
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      employeeId.trim() === "" ||
      phoneNumber.trim() === "" ||
      projectId.trim() === ""
    ) {
      setResponseMessage("All fields are required");
      setResponseModalVisible(true);
      return;
    }
  
    // Additional validation
    if (!formData.email.includes("@valtech")) {
      setResponseMessage("Email must contain @valtech");
      setResponseModalVisible(true);
      return;
    }

    // Prepare the data to be sent to the backend
    const postData = {
      employeeId: parseInt(formData.employeeId),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: parseInt(formData.phoneNumber),
      projectId: formData.projectId,
    };

    // Setting axios header for authorization
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // Make a POST request to the backend API endpoint
    axios
      .post("http://localhost:9006/bookmyseat/admin/createUser", postData)
      .then((res) => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          employeeId: "",
          phoneNumber: "",
          workLocation: "Bengaluru",
          projectName: "",
        });
        setResponseMessage(res.data);
        setResponseModalVisible(true);
        setFormVisible(false);
      })
      .catch((err) => {
        const errorMessage = err.response ? err.response.data : 'An error occurred';
        setResponseMessage(errorMessage);
        console.log(err.response);
        setResponseModalVisible(true);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.form}>
      <form className={styles.userForm} onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <label htmlFor="email">Official Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
        />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <div className={styles.clubTwoLabel}>
          <label htmlFor="workLocation">Location:</label>
          <select
            name="workLocation"
            className={styles.workLocation}
            value={formData.workLocation}
            onChange={handleChange}
          >
            <option value="Bengaluru">Bengaluru</option>
          </select>

          <label htmlFor="projectName">Project:</label>
          <select
            name="projectId"
            className={styles.projectName}
            value={formData.projectId}
            onChange={handleChange}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.btn}>
          <button type="submit">Submit</button>
          <button className={styles.close} onClick={() => onClose()}>
            Close
          </button>
        </div>

        {responseModalVisible && (
          <div className={styles.responseModal}>
            <div className={styles.responseModalContent}>
              <h2>Response</h2>
              <p>{responseMessage}</p>
              <button
                className={styles.closeX}
                onClick={handleCloseResponseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
