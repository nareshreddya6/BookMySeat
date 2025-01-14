import { useNavigate } from "react-router";
import styles from "../styles/messageaHandling.module.css";

const MessageHandle = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCloseModal = () => {
    // Call the onClose function to close the modal
    onClose();
    navigate("/login");
  };

  return (
    // Container for Alert
    <div className={styles.messageContainer}>
      {/* Container for Message */}
      <div className={styles.messageHandle}>
        <h1>Response</h1>

        {/* Displaying the message passed by registeration page */}
        <div className={styles.message}>{message}</div>

        {/* Buttons to navigate */}
        <div className={styles.messageBtn}>
          <button className={styles.confirmBtn} onClick={handleCloseModal}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHandle;