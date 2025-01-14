import React from "react";
import styles from "./responseModal.module.css";

export default function ResponseModal({
  message,
  onClose,
  heading,
  selectedUserData,
}) {
  return (
    <div className={styles.responseModal}>
      <div className={styles.modalContent}>
        <h1 className={styles.modalHeading}>{heading}</h1>
        <p className={styles.modalMessage}>{message}</p>
        {selectedUserData && (
          <table className={styles.usertable}>
            <thead>
              <tr>
                <th className={styles.tableHeading}>Employee Id</th>
                <th className={styles.tableHeading}>Name</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{selectedUserData.employeeId}</td>
                <td>{selectedUserData.employeeName}</td>
              </tr>
            </tbody>
          </table>
        )}
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
