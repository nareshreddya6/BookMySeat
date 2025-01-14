import React from "react";
import styles from "../styles/reserveSeatModal.module.css"; // Import CSS file for styling

export default function ReserveSeatModal({
  heading,
  message,
  onCancel,
  onConfirm,
  userDetail,
}) {
  return (
    <div className={styles.responseModal}>
      <div className={styles.modalContent}>
        <h1 className={styles.modalHeading}>{heading}</h1>
        <p className={styles.modalMessage}>{message}</p>
        <table className={styles.usertable}>
          <thead>
            <tr>
              <th className={styles.tableHeading}>Employee Id</th>
              <th className={styles.tableHeading}> FLoor</th>
              <th className={styles.tableHeading}>Seat Number</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{userDetail.employeeId}</td>
              <td>{userDetail.floor}</td>
              <td>{userDetail.seatNumber}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
