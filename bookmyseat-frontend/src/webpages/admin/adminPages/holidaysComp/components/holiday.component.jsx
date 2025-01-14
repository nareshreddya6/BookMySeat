import React, { useEffect, useState } from "react";
import styles from "../../locationComp/styles/addNewInfo.module.css";
import axios from "axios";
import AddHolidayForm from "./addHoliday.component";
import ViewHolidayTable from "./viewHolidays.component";
import Toaster from "../../../../toaster/components/toaster.component";

const Holidays = () => {
  // States needed in the component
  const [holidays, setHolidays] = useState([]);

  // state to toggle between child component
  const [showAdd, setShowAdd] = useState(true);
  const [addHoliday, setAddHoliday] = useState(false);
  const [updateHoliday, setUpdateHoliday] = useState(false);

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Function to get and store floors details from server
  useEffect(() => {
    const fetchData = () => {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get("http://localhost:9006/bookmyseat/admin/holidays")
        .then((response) => {
          // console.log("response Data", response.data);
          setHolidays(response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Error fetching holidays!. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, [addHoliday, updateHoliday]);

  // Function to handle click on Add Holiday button
  const handleAddHoliday = (newHoliday) => {
    const data = {
      holidayName: newHoliday.name,
      holidayDate: newHoliday.date,
    };
    // console.log("Holiday Added : ", data);
    // Setting axios header for authorization
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // console.log(token);

    axios
      .post("http://localhost:9006/bookmyseat/admin/createHoliday", data)
      .then((res) => {
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);
        setAddHoliday(!addHoliday);
        // alert(res.data);
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage(err.response.data);
        setShowToaster(true);
      });
  };

  return (
    <div className={styles.comboContainer}>
      {/* Buttons to toggle between child component */}
      <div className={styles.selectNeededOptions}>
        <button
          className={showAdd ? styles.activeButton : styles.selectionBtn}
          onClick={() => setShowAdd(true)}
        >
          Add Holidays
        </button>
        <button
          className={!showAdd ? styles.activeButton : styles.selectionBtn}
          onClick={() => setShowAdd(false)}
        >
          View Holidays
        </button>
      </div>

      {/* Renders AddLocationForm if true otherwise renders ViewLocationTable Component */}
      {showAdd ? (
        <AddHolidayForm onHandleAdd={handleAddHoliday} />
      ) : (
        <ViewHolidayTable
          holidays={holidays}
          setUpdateHoliday={setUpdateHoliday}
        />
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

export default Holidays;
