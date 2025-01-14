import React, { useState } from "react";
import styles from "../../locationComp/styles/addNewInfo.module.css";
import Toaster from "../../../../toaster/components/toaster.component";

const AddProjectForm = ({ onHandleAdd }) => {
  // States needed in the component
  const [projectName, setProjectName] = useState("");

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Function to handle click on Add Project button
  const handleAdd = () => {
    if (projectName) {
      onHandleAdd({ name: projectName.trim() });
      setProjectName("");
    } else {
      setModalHeading("Incomplete data!");
      setModalMessage("Please fill the details.");
      setShowToaster(true);
    }
  };

  return (
    <div className={styles.addContainer}>
      <div className={styles.addName}>
        <h1>Add Project</h1>

        {/* Input to take user input for project name */}
        <div className={styles.inputLabelCombo}>
          <label htmlFor="addProject">Project Name: </label>
          <input
            type="text"
            name="addProject"
            id="addProject"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        {/* Button to add Project */}
        <button className={styles.addBtn} onClick={handleAdd}>
          Add Project
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

export default AddProjectForm;
