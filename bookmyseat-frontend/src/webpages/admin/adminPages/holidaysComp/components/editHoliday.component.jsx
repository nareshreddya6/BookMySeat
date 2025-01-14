import React, { useEffect, useState } from "react";
import styles from "../styles/editHoliday.module.css";
import Toaster from "../../../../toaster/components/toaster.component";
import axios from "axios";

const EditHoliday = ({ holiday, setShowEdit, setUpdateHoliday }) => {
  // States needed in the component
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayId, setHolidayId] = useState(0);

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // console.log(holiday);
    setHolidayName(holiday.holidayName);
    setHolidayDate(holiday.holidayDate);
    setHolidayId(holiday.id);
  }, []);

  // Function to handle click on Add Holiday button
  const handleAdd = () => {
    if (!holidayName || !holidayDate) {
      setModalHeading("Alert!!");
      setModalMessage("Please fill in all the details.");
      setShowToaster(true);
      setUpdateHoliday((prevState) => !prevState);
      return; // Prevent further execution
    }

    const data = {
      id: holidayId,
      holidayName: holidayName.trim(),
      holidayDate: holidayDate.trim(),
    };

    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("http://localhost:9006/bookmyseat/admin/updateHoliday", data)
      .then((res) => {
        // console.log(res.data);
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);
        setShowEdit(false);
      })
      .catch((err) => {
        console.log(err);
        setModalHeading("Error");
        setModalMessage(err.response.data);
        setShowToaster(true);
      });

    setHolidayName("");
    setHolidayDate("");
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  return (
    <div className={styles.editContainer}>
      <div className={styles.editName}>
        <h1>Edit Holiday</h1>

        {/* Input to take user input for holiday name */}
        <div className={styles.inputLabelCombo}>
          <label htmlFor="holidayName">Holiday Name: </label>
          <input
            type="text"
            name="holidayName"
            id="holidayName"
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
            min={holidayDate}
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
          />
        </div>

        <div className={styles.modalBtns}>
          {/* Button to save Holiday */}
          <button className={styles.addButton} onClick={handleAdd}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
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

export default EditHoliday;
