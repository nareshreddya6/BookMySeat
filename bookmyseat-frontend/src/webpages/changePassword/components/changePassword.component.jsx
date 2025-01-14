import React, { useState } from "react";
import { faEye, faEyeSlash, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/changePassword.module.css";
import axios from "axios";
import { ShieldQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Toaster from "../../toaster/components/toaster.component";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseModalVisible, setResponseModalVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  // const handleOpenModal = () => {
  //     setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //     setShowModal(false);
  // };

  const handleCloseResponseModal = () => {
    setResponseModalVisible(false);
  };

  const handleChangePassword = () => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    console.log(token);

    if (!oldPassword || !newPassword || !confirmPassword) {
      // setResponseMessage("Please fill in all password fields");
      // setResponseModalVisible(true);
      setModalHeading("Error");
      setModalMessage("Please fill in all password fields");
      setShowToaster(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      // setResponseMessage("New password and confirm password do not match");
      // setResponseModalVisible(true);
      setModalHeading("Error");
      setModalMessage("New password and confirm password do not match");
      setShowToaster(true);
      return;
    }

    if (oldPassword === newPassword) {
      // setResponseMessage(
      //   "Old password and new password should not be the same"
      // );
      // setResponseModalVisible(true);
      setModalHeading("Error");
      setModalMessage("Old password and new password should not be the same");
      setShowToaster(true);
      return;
    }

    axios
      .put("http://localhost:9006/bookmyseat/user/changepassword", {
        currentPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((res) => {
        // alert('Password changed successfully');
        // setResponseMessage(res.data);
        // setResponseModalVisible(true);
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        // handleCloseModal();
      })
      .catch((err) => {
        // alert("Failed to change password. Please try again.");
        // console.error("localhost",err);
        setModalHeading("Error");
        setModalMessage(
          "Something went wrong while fetching holidays. Please try again."
        );
        setShowToaster(true);
      });
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  return (
    <>
      <div className={styles.headerStyle}></div>
      {/* main container for changePassword */}
      <div className={styles.changePassword}>
        <div className={styles.setting}>
          <div className={styles.userInfo}>
            Change Password <FontAwesomeIcon icon={faGear} />
          </div>
        </div>

        {/* three input field is provided for user to change his password */}
        <div className={styles.changepasswordfield}>
          <div className={styles.forminput}>
            <div className={styles.paswordHintIcon}>
              <label htmlFor="currentPassword">
                Current Password<span>*</span>
              </label>
            </div>
            <input
              type={showOldPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <span
              onClick={toggleOldPasswordVisibility}
              className={styles.eyeIcon}
            >
              <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
            </span>
          </div>

          <div className={styles.forminput}>
            <div className={styles.paswordHintIcon}>
              <label htmlFor="newPassword">
                New Password<span>*</span>
              </label>

              <span className={styles.iconContainer}>
                <ShieldQuestion color="grey" size={20} />
                <span className={styles.tooltip}>
                  Your password must contain at least:
                  <ul>
                    <li>1 lowercase alphabet</li>
                    <li>1 uppercase alphabet</li>
                    <li>1 special character</li>
                    <li>1 number</li>
                    <li>Minimum 10 characters</li>
                  </ul>
                </span>
              </span>
            </div>

            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              onClick={toggleNewPasswordVisibility}
              className={styles.eyeIcon}
            >
              <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
            </span>
          </div>

          <div className={styles.forminput}>
            <div className={styles.paswordHintIcon}>
              <label htmlFor="confirmPassword">
                Confirm New Password<span>*</span>
              </label>
            </div>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={handleChangePassword}>Change Password</button>
        </div>
        {/* this is a modal where response from backend will be shown to the user    */}
        {/* {responseModalVisible && (
          <div className={styles.responseModal}>
            <div className={styles.responseModalContent}>
              <h2>Response</h2>
              <p>{responseMessage}</p>
              <button onClick={handleCloseResponseModal} className={styles.btn}>
                Ok
              </button>
            </div>
          </div>
        )} */}

        {showToaster && (
          <Toaster
            message={modalMessage}
            setShowToaster={setShowToaster}
            heading={modalHeading}
          />
        )}
      </div>
    </>
  );
}
