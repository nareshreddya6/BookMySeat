import { useEffect, useState } from "react";
import styles from "../styles/actionCenter.module.css";
import WaitingTab from "./inWaiting.component";
import ApprovedTab from "./approved.component";
import RejectedTab from "./rejected.component";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";

const ActionCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("waiting");

  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [rejectedEmployees, setRejectedEmployees] = useState([]);
  const [count, setCount] = useState(0);
  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  //   Function to get Data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Setting axios header for authorization
        const token = sessionStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        // console.log(token);

        // Axios request to get data from server
        const response = await axios.get(
          "http://localhost:9006/bookmyseat/admin/userDetails"
        );

        // console.log(response.data);

        setPendingEmployees(response.data.pendingUser);
        setApprovedEmployees(response.data.approvedUsers);
        setRejectedEmployees(response.data.rejectedUser);
      } catch (error) {
        setModalHeading("Error");
        setModalMessage("Error Fetching data!. Please try again.");
        setShowToaster(true);
      }
    };
    fetchData();
  }, [count]);

  // Function to handle click on approve button
  const handleApprove = (email) => {
    console.log(email);
    // Setting axios header for authorization
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // console.log(token);
    axios
      .post(
        `http://localhost:9006/bookmyseat/admin/approveregistration?email=${email}`
      )
      .then((res) => {
        // alert(res.data);
        setCount((prevCount) => prevCount + 1);
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage(err.response.data);
        setShowToaster(true);
      });
  };

  // Function to handle click on reject button
  const handleReject = (email) => {
    console.log(email);
    // Setting axios header for authorization
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // console.log(token);
    axios
      .post(
        `http://localhost:9006/bookmyseat/admin/rejectregistration?email=${email}`
      )
      .then((res) => {
        // alert(res.data);
        setCount((prevCount) => prevCount + 1);
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage(err.response.data);
        setShowToaster(true);
      });
  };

  // Function to filter employees based on employeeID
  const filterEmployeesBySearchQuery = (employees, searchQuery) => {
    return employees.filter((employee) =>
      employee.employeeId.toString().includes(searchQuery)
    );
  };

  // Function to filter pending employees based on employeeID
  const filteredPendingEmployees = filterEmployeesBySearchQuery(
    pendingEmployees,
    searchQuery
  );

  // Function to filter approved employees based on employeeID
  const filteredApprovedEmployees = filterEmployeesBySearchQuery(
    approvedEmployees,
    searchQuery
  );

  // Function to filter rejected employees based on employeeID
  const filteredRejectedEmployees = filterEmployeesBySearchQuery(
    rejectedEmployees,
    searchQuery
  );

  return (
    <div className={styles.actionCenterContainer}>
      {/* Div to select opption which component to show */}
      <div className={styles.selectNeededOptions}>
        <button
          className={
            activeTab === "waiting" ? styles.activeButton : styles.waitingBtn
          }
          onClick={() => setActiveTab("waiting")}
        >
          Waiting
        </button>
        <button
          className={
            activeTab === "approved" ? styles.activeButton : styles.approvedBtn
          }
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={
            activeTab === "rejected" ? styles.activeButton : styles.rejectedBtn
          }
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Component to render if Waiting list is to be opened */}
      {activeTab === "waiting" && (
        <WaitingTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleApprove={handleApprove}
          handleReject={handleReject}
          pendingEmployees={filteredPendingEmployees}
        />
      )}

      {/* Component to render if approved list is to be opened */}
      {activeTab === "approved" && (
        <ApprovedTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          approvedEmployees={filteredApprovedEmployees}
        />
      )}

      {/* Component to render if rejected list is to be opened */}
      {activeTab === "rejected" && (
        <RejectedTab
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          rejectedEmployees={filteredRejectedEmployees}
        />
      )}
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

export default ActionCenter;
