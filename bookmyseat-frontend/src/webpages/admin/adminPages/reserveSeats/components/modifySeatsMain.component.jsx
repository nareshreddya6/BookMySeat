import { useState } from "react";
import styles from "../styles/modifySeatsMain.module.css";

import { AddUserReservation } from "./addUserReservation.component";
import { RemoveUserReservation } from "./removeUserReservation.component";
import { RemoveProjectReservation } from "./removeProjectReservation.component";
import { AddProjectReservation } from "./addProjectReservation.component";

export const ModifySeatsMain = () => {
  const [reservationType, setReservationType] = useState("addUser");

  const handleReservationToggle = (val) => {
    setReservationType(val);
  };
// conditionally rendering copmonent based on user selection
  const renderReservationComponent = () => {
    switch (reservationType) {
      case "addUser":
        return <AddUserReservation />;
      case "removeUser":
        return <RemoveUserReservation />;
      case "addProject":
        return <AddProjectReservation />;
      case "removeProject":
        return <RemoveProjectReservation />;
      default:
        return <AddUserReservation />;
    }
  };

  return (
    // Main Container
    <div className={styles.modifySeatsMainContainer}>
      <div className={styles.buttonsContainer}>
        <button
          onClick={() => handleReservationToggle("addUser")}
          className={styles.addReservationButton}
        >
          Add User Reservation
        </button>
        <button
          onClick={() => handleReservationToggle("removeUser")}
          className={styles.removeReservationButton}
        >
          Remove User Reservation
        </button>
        <button
          onClick={() => handleReservationToggle("addProject")}
          className={styles.addReservationButton}
        >
          Add Project Reservation
        </button>
        <button
          onClick={() => handleReservationToggle("removeProject")}
          className={styles.removeReservationButton}
        >
          Remove Project Reservation
        </button>
      </div>
      <hr />
      {/* consitionally rendered component */}
      <div>{renderReservationComponent()}</div>
    </div>
  );
};
