import { useRef, useState } from "react";
import styles from "../styles/forgotPassword.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResponseModal from "../../messageModal/responseModal";
import Toaster from "../../toaster/components/toaster.component";

export const ForgotPassword = () => {
  const emailRef = useRef();
  const [emailError, setEmailError] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // states to manage response message modal and meaasge
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  // const [showModal, setShowModal] = useState(false);

  // function to close modal
  // const closeModal = () => {
  //   setShowModal(false);
  // };

  const navigate = useNavigate();
  // regex for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[Vv]altech\.com$/;

  // function for email validation
  const handleEmail = () => {
    const isValidEmail = emailRegex.test(emailRef.current.value);
    if (emailRef.current.value == "") {
      setEmailError("Enter Email to continue");
      emailRef.current.style.borderColor = "red";
    } else if (!isValidEmail) {
      setEmailError("Invalid email address.");
      emailRef.current.style.borderColor = "red";
    } else {
      setEmailError("");
      emailRef.current.style.borderColor = "initial";
    }
  };

  // function to handle submit
  const handleSubmit = () => {
    // again check for email validation
    handleEmail();
    // if email is correct - post the data
    if (!emailError) {
      const email = emailRef.current.value;
      setButtonDisabled(true);
      axios
        .post("http://localhost:9006/bookmyseat/forgotpassword", { email })
        .then((res) => {
          setModalHeading("Success");
          setModalMessage("Please Check your inbox for further Process.");
          setShowToaster(true);
          // setShowModal(true);
          setTimeout(() => {
            navigate("/login");
            setButtonDisabled(false);
          }, 3000);

          // console.log(res);
        })
        .catch((err) => {
          setModalHeading("Failure");
          setModalMessage("Something went wrong!. Please Try again.");
          setShowToaster(true);
          // setShowModal(true);
          setButtonDisabled(false);
        });
    }
  };
  return (
    <div className={styles.mainContainer}>
      {/* forgot password Container */}
      <div className={styles.forgotPasswordContainer}>
        {/* container for image */}
        <div className={styles.imgContainer}>
          <img src="/assets/Images/forgotPassword.avif" alt="Forgot Password" />
        </div>
        {/* container for form accepting email from user */}
        <div className={styles.emailCard}>
          <h2 className={styles.heading}>Forgot Password</h2>
          <p>
            We will send you an email with instructions on how to reset your
            password.
          </p>
          {/* form field container */}
          <div className={styles.formFieldsContainer}>
            <input
              className={styles.formInput}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your registered email."
              ref={emailRef}
              onBlur={handleEmail}
            />
            <div className={styles.emailError}>
              {emailError && (
                <span className={styles.emailError}>{emailError}</span>
              )}
            </div>
          </div>
          {/* button - to handle submit functionality */}
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={buttonDisabled}
          >
            Email Me
          </button>
          <div className={styles.loginLinkContainer}>
            <a href="/login">Login here!</a>
          </div>
        </div>
      </div>
      {/* {showModal && (
        <ResponseModal message={modalMessage} onClose={closeModal} />
      )} */}

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
