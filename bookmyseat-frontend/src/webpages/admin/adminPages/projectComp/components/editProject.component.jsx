import React, { useEffect, useState } from "react";
import styles from "../../holidaysComp/styles/editHoliday.module.css";
import Toaster from "../../../../toaster/components/toaster.component";
import axios from "axios";

const EditProject = ({ project, setShowEdit, setCount }) => {
  // States needed in the component
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState(0);

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    console.log(project);
    setProjectName(project.name);
    setProjectId(project.id);
  }, []);

  // Function to handle click on Add Holiday button
  const handleAdd = () => {
    if (!projectName) {
      setModalHeading("Alert!!");
      setModalMessage("Please fill in all the details.");
      setShowToaster(true);
      return; // Prevent further execution
    }

    const data = {
      projectId: projectId,
      projectName: projectName.trim(),
    };

    console.log("Data: ", data);
    // alert(data);
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("http://localhost:9006/bookmyseat/admin/updateProject", data)
      .then((res) => {
        console.log(res.data);
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);
        setCount((prevCount) => prevCount + 1);
        setShowEdit(false);
      })
      .catch((err) => {
        console.log(err);
        setModalHeading("Error");
        setModalMessage(err.response);
        setShowToaster(true);
      });

    setProjectId(0);
    setProjectName("");
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  return (
    <div className={styles.editContainer}>
      <div className={styles.editName}>
        <h1>Edit Project</h1>

        {/* Input to take user input for holiday name */}
        <div className={styles.inputLabelCombo}>
          <label htmlFor="projectName">Project Name: </label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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

export default EditProject;
