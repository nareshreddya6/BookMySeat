import React, { useEffect, useState } from "react";
import styles from "../styles/modifyShiftsMain.module.css";
import axios from "axios";
import { ShiftData } from "./modifyShifts.component";
import Toaster from "../../../../toaster/components/toaster.component";

const ModifyShiftsMain = () => {
  // Required States
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const [shifts, setShifts] = useState([]);

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // function to get shift data from server
  useEffect(() => {
    const fetchData = () => {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get("http://localhost:9006/bookmyseat/admin/listofshiftdetails")
        .then((response) => {
          // const data = response.data;
          setShifts(response.data);
          // console.log("Shifts Detail: ", response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Error fetching Shifts Data:. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // function for to get users data
  useEffect(() => {
    const fetchData = () => {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get("http://localhost:9006/bookmyseat/admin/users")
        .then((response) => {
          const data = response.data.users;
          setUserData(data);
          // console.log("users: ", response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Error fetching user Data:. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // Function to filter attendees based on search query
  const filteredData = userData.filter((user) => {
    return user.employeeId.toString().includes(searchQuery.toString());
  });

  return (
    <div className={styles.editShiftDetails}>
      <h2>Map Shifts</h2>
      {/* Header for Page */}
      <div className={styles.shiftHeader}>
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
      <ShiftData
        filteredData={filteredData}
        shifts={shifts}
        setShifts={setShifts}
        searchQuery={searchQuery}
      />
      
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

export default ModifyShiftsMain;
