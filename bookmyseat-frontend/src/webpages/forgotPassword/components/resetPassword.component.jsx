import React, { useEffect, useRef, useState } from "react";
import { faEye, faEyeSlash, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/resetPassword.module.css";
import axios from "axios";
import { ShieldQuestion } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ResponseModal from "../../messageModal/responseModal";
export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState();
  const [passwordError, setPasswordError] = useState();
  // states to manage response message modal and meaasge
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const navigate = useNavigate();
  // extracting token from params to fetch user details
  const { token } = useParams();

  // getting user details from token
  useEffect(() => {
    axios
      .get(`http://localhost:9006/bookmyseat/resetpassword/${token}`)
      .then((res) => {
        setUserEmail(res.data.user.email);
      })
      .catch((err) => {
        setModalMessage(err.response.data);
        setShowModal(true);
        // console.log(err)
      });
  }, []);

  const validateCredentials = () => {
    // Validate the Password Format
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Entered password did not fulfill the password criteria."
      );
      setButtonDisabled(true);
    } else {
      setPasswordError("");
      setButtonDisabled(false);
    }
  };

  // function to handle click functionality on change password button
  const handleResetPassword = () => {
    const data = {
      email: userEmail,
      newPassword: newPassword,
    };
    // check if all fields are present
    if (!data.newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }
    // check if newpassword and confirm password are same or not
    if (data.newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }
    // post data to reset password
    axios
      .put(`http://localhost:9006/bookmyseat/resetpassword/${token}`, data)
      .then((res) => {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        setModalMessage(res.data);
        setShowModal(true);
      })
      .catch((err) => {
        setModalMessage("Failed to change password!. Please try again.");
        setShowModal(true);
      });
  };

  // managing password visibility
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };
  // function to close modal
  const closeModal = () => {
    setShowModal(false);
    navigate("/login")
  };
  return (
    <>
      {/* main container for changePassword */}
      <div className={styles.changePassword}>
        <div className={styles.setting}>
          <div className={styles.heading}>
            Change Password <FontAwesomeIcon icon={faGear} />
          </div>
        </div>
        <div className={styles.error}>
          {passwordError ? <h3>{passwordError}</h3> : ""}
        </div>

        {/* three input field is provided for user to change his password */}
        <div className={styles.changepasswordfield}>
          <div className={styles.forminput}>
            <div className={styles.paswordHintIcon}>
              <label htmlFor="currentPassword">Registered Email</label>
            </div>
            <input type="email" name="email" value={userEmail} readOnly />
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
              onBlur={validateCredentials}
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

          <button onClick={handleResetPassword} disabled={buttonDisabled}>
            Change Password
          </button>
        </div>
        {showModal && (
          <ResponseModal message={modalMessage} onClose={closeModal} />
        )}
      </div>
    </>
  );
}
