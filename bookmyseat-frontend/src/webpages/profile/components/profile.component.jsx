import React, { useEffect, useState } from "react";
import styles from "../styles/profile.module.css";
import {
  faCamera,
  faPenToSquare,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Toaster from "../../toaster/components/toaster.component";

export default function Profile() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  // const handleOpenModal = () => {
  //     setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //     setShowModal(false);
  // };

  const handleOpenPhoneModal = () => {
    setShowPhoneModal(true);
  };

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
  };

  //fetching profile details from backend through the api used in axios
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    // console.log(token);

    axios
      .get("http://localhost:9006/bookmyseat/user/profile")
      .then((res) => setData(res.data))
      .catch((err) => {
        // console.log(err);
        setModalHeading("Error");
        setModalMessage("Something went wrong. Please try again.");
        setShowToaster(true);
      });
  }, []);

  //this function is called when user edit their phoneNumber. The updated phoneNumber will be saved in the backend.
  const handleSavePhoneNumber = () => {
    if (!/^\d{10}$/.test(updatedPhoneNumber)) {
      setErrorMessage("Phone number should consist of 10 digits");
      return;
    }

    axios
      .put("http://localhost:9006/bookmyseat/user/editprofile", {
        phoneNumber: updatedPhoneNumber,
      })
      .then((res) => {
        // console.log(res.data);
        // alert(res.data);
        setModalHeading("Success");
        setModalMessage(res.data);
        setShowToaster(true);

        axios
          .get("http://localhost:9006/bookmyseat/user/profile")
          .then((res) => {
            // Update the local state with the new user data
            setData(res.data);
          })
          .catch((err) => {
            // console.error(err);
            setModalHeading("Error");
            setModalMessage("Something went wrong. Please try again.");
            setShowToaster(true);
          });
        // Clear the updatedPhoneNumber state
        setUpdatedPhoneNumber("");
        // Close the phone modal
        handleClosePhoneModal();
        setErrorMessage("");
      })
      .catch((err) => {
        // console.error(err);
        setErrorMessage("Failed to update phone number. Please try again.");
        setModalHeading("Error");
        setModalMessage("Something went wrong. Please try again.");
        setShowToaster(true);
      });
  };

  //this function is called to get the initials of the user
  const getInitials = (firstName, lastName) => {
    const firstInitial = data?.firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = data?.lastName?.charAt(0)?.toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  const initials = getInitials(data.firstName, data.lastName);
  return (
    //main container for profile page
    <div className={styles.profilePage}>
      {/* for displaying user initials */}
      <div className={styles.firstSection}>
        <div className={styles.outercircle}>
          <div className={styles.circle}>{initials}</div>
        </div>
        <FontAwesomeIcon className={styles.camera} icon={faCamera} />
      </div>
      {/* for displaying user's information */}
      <div className={styles.secondSection}>
        <div className={styles.userInfo}>User Details</div>
        <FontAwesomeIcon
          icon={faPenToSquare}
          className={styles.pen}
          onClick={handleOpenPhoneModal}
        />
      </div>
      <div className={styles.profileComp}>
        <div className={styles.compForDetails}>
          Branch <p> Bengaluru </p>
        </div>
        <div className={styles.compForDetails}>
          Email ID <p>{data?.email || ""} </p>
        </div>
        <div className={styles.compForDetails}>
          Phone Number <p>{data?.phoneNumber || ""}</p>
        </div>
        <div className={styles.compForDetails}>
          Employee ID <p>{data?.employeeId || ""}</p>
        </div>
        <div className={styles.compForDetails}>
          Role <p>{data?.role?.roleName || ""}</p>
        </div>
      </div>

      {/* as soon as user clicks on edit icon the modal opens with phone number field */}
      {showPhoneModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* <span className={styles.close} onClick={handleClosePhoneModal}>&times;</span> */}
            <h2>Change Phone Number</h2>
            <input
              type="text"
              placeholder="New Phone Number"
              value={updatedPhoneNumber}
              onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
            />
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            <div className="btncontainer">
              <button
                className={styles.savePhoneno}
                onClick={handleSavePhoneNumber}
              >
                Save
              </button>
              <button
                className={styles.cancelPhoneno}
                onClick={handleClosePhoneModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </div>
  );
}
