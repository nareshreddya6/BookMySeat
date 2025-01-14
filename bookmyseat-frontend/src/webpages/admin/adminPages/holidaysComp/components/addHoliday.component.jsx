import React, { useState } from "react";
import styles from "../../locationComp/styles/addNewInfo.module.css";
import Toaster from "../../../../toaster/components/toaster.component";

const AddHolidayForm = ({ onHandleAdd }) => {
  // States needed in the component
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  //Current Date
  const todayDate = new Date().toISOString().split("T")[0];

  // Function to handle click on Add Holiday button
  const handleAdd = () => {
    if (holidayName && holidayDate) {
      onHandleAdd({ name: holidayName.trim(), date: holidayDate.trim() });
      setHolidayName("");
      setHolidayDate("");
    } else {
      setModalHeading("Alert!!");
      setModalMessage("Please fill the details.");
      setShowToaster(true);
    }
  };

  return (
    <div className={styles.addContainer}>
      <div className={styles.addName}>
        <h1>Add Holiday</h1>

        {/* Input to take user input for holiday name */}
        <div className={styles.inputLabelCombo}>
          <label htmlFor="addHoliday">Holiday Name: </label>
          <input
            type="text"
            name="addHoliday"
            id="addHoliday"
            placeholder="Holiday Title"
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
          />
        </div>

        {/* Input to take user input for holiday name */}
        <div className={styles.inputLabelCombo}>
          <label htmlFor="holidayDate">Holiday Date: </label>
          <input
            type="date"
            name="holidayDate"
            id="holidayDate"
            min={todayDate}
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
          />
        </div>

        {/* Button to add Holiday */}
        <button className={styles.addBtn} onClick={handleAdd}>
          Add Holiday
        </button>
      </div>

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

export default AddHolidayForm;
