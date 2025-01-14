import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/registrationForm.module.css";
import axios from "axios";
import { Eye, EyeOff, ShieldQuestion } from "lucide-react";
import MessageHandle from "./messageHandling.component";
// import Toaster from "../../toaster/components/toaster.component";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    phoneNumber: "",
    location: "",
    projectName: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // const [projects, setProjects] = useState([]);
  // states to manage response message modal and message
  // const [modalHeading, setModalHeading] = useState("");
  // const [modalMessage, setModalMessage] = useState("");
  // const [showToaster, setShowToaster] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = sessionStorage.getItem("token");
  //       axios.defaults.headers.common["Authorization"] = token;
  //       const response = await axios.get(
  //         "http://localhost:9006/bookmyseat/registration"
  //       );
  //       setProjects(response.data);
  //       // console.log(response.data);
  //     } catch (error) {
  //       // console.error("Error fetching projects:", error);
  //       setModalHeading("Error");
  //       setModalMessage("Something went wrong. Please try again");
  //       setShowToaster(true);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  const openWindow = () => {
    setTimeout(() => {
      handleOpen();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        employeeId: "",
        phoneNumber: "",
        location: "",
        projectName: "",
        password: "",
        confirmPassword: "",
      });
    }, 8000);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleBlur = useCallback(
    (field) => {
      const errors = validateField(field);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [field]: errors[field],
      }));
    },
    [formData]
  );

  const handleSubmit = useCallback(() => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const {
        firstName,
        lastName,
        email,
        employeeId,
        phoneNumber,
        projectName,
        password,
      } = formData;

      const user = {
        firstName,
        lastName,
        email,
        employeeId,
        phoneNumber,
        projectName,
        password,
      };

      setButtonDisabled(true);

      axios
        .post("http://localhost:9006/bookmyseat/registration", user)
        .then((res) => {
          // console.log(res.data);
          setMessage(res.data);
        })
        .catch((err) => {
          // console.error("Error:", err.response);
          setMessage(err.response.data);
        });
      openWindow();
    }
  }, [formData, handleOpen]);

  const validateForm = useCallback(() => {
    const errors = {};
    for (const field in formData) {
      const fieldErrors = validateField(field);
      if (Object.keys(fieldErrors).length > 0) {
        errors[field] = fieldErrors[field];
      }
    }
    return errors;
  }, [formData]);

  const validateField = useCallback(
    (field) => {
      const errors = {};

      switch (field) {
        case "firstName":
          if (!formData[field].trim()) {
            errors[field] = "First Name is required";
          }
          break;
        case "lastName":
          if (!formData[field].trim()) {
            errors[field] = "Last Name is required";
          }
          break;
        case "email":
          if (!formData[field].trim()) {
            errors[field] = "Email is required";
          } else if (!isValidEmail(formData[field])) {
            errors[field] = "Invalid email format";
          }
          break;
        case "employeeId":
          if (!formData[field].trim()) {
            errors[field] = "Employee ID is required";
          } else if (!isValidEmployeeId(formData[field])) {
            errors[field] = "Employee ID must be a number";
          }
          break;
        case "phoneNumber":
          if (!formData[field].trim()) {
            errors[field] = "Phone Number is required";
          } else if (!isValidPhoneNumber(formData[field])) {
            errors[field] = "Invalid Phone Number";
          }
          break;
        case "location":
          if (!formData[field].trim()) {
            errors[field] = "Work Location is required";
          }
          break;
        case "projectName":
          if (!formData[field].trim()) {
            errors[field] = "Project Name is required";
          }
          break;
        case "password":
          if (!formData[field].trim()) {
            errors[field] = "Password is required";
          } else if (formData[field].length < 10) {
            errors[field] = "Password must be at least 10 characters";
          } else if (!isValidPassword(formData[field])) {
            errors[field] =
              "Must contain alphabets, number and special characters.";
          }
          break;
        case "confirmPassword":
          if (
            !formData[field].trim() ||
            formData.password !== formData[field]
          ) {
            errors[field] = "Passwords do not match";
          }
          break;
        default:
          break;
      }
      return errors;
    },
    [formData]
  );

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[Vv]altech\.com$/;
    return emailRegex.test(email);
  };

  const isValidEmployeeId = (employeeId) => {
    const employeeIdRegex = /^[0-9]*$/;
    return employeeIdRegex.test(employeeId);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  // Function to Validate the Password Format
  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
    return passwordRegex.test(password);
  };

  const togglePasswordVisibility1 = useCallback(() => {
    setPasswordVisible1((prevVisible) => !prevVisible);
  }, []);

  return (
    // Registration Page UI

    <div className={styles.registrationComp}>
      <div className={styles.registrationPage}>
        <div className={styles.formContainer}>
          {/* Registration Form */}
          <div className={styles.registrationForm}>
            <div className={styles.profileImg}>
              <img src="/assets/Images/profile.png" alt="profile" />
            </div>

            {/* Registration Form Heading */}
            <div className={styles.formHeading}>
              <hr className={styles.customHr} />
              <p>Register Here</p>
              <hr className={styles.customHr} />
            </div>

            {/* Code to get User Data as Input*/}
            <div className={styles.formDetails}>
              {/* Code to get User Name as Input*/}
              {/* Input for firstname */}
              <label
                className={styles.registrationLabel}
                htmlFor="employeeName"
              >
                Full Name<span>*</span>
              </label>
              <div className={styles.comboInputs}>
                <div className={styles.inputTag}>
                  <input
                    className={`${
                      formErrors.firstName
                        ? styles.errorInput
                        : styles.registrationInput
                    }`}
                    type="text"
                    id="employeeName"
                    name="firstName"
                    placeholder="John"
                    autoComplete="off"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("firstName")}
                  />

                  {/* Printing Validation Warning */}
                  <div className={styles.validationWarning}>
                    {formErrors.firstName && (
                      <p className={styles.error}>{formErrors.firstName}</p>
                    )}
                  </div>
                </div>

                {/* Input for lastname */}
                <div className={styles.inputTag}>
                  <input
                    className={`${
                      formErrors.lastName
                        ? styles.errorInput
                        : styles.registrationInput
                    }`}
                    type="text"
                    id="employeeName1"
                    name="lastName"
                    placeholder="Doe"
                    autoComplete="off"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("lastName")}
                  />

                  {/* Printing Validation Warning */}
                  <div className={styles.validationWarning}>
                    {formErrors.lastName && (
                      <p className={styles.error}>{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Code to get User Email as Input*/}
              <label className={styles.registrationLabel} htmlFor="email">
                Office Mail ID<span>*</span>
              </label>
              <div className={styles.inputTag}>
                <input
                  // className={styles.registrationEmailInput}
                  className={`${
                    formErrors.email
                      ? styles.errorEmailInput
                      : styles.registrationEmailInput
                  }`}
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  placeholder="john.doe@valtech.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                />
              </div>

              {/* Printing Validation Warning */}
              <div className={styles.validationWarning}>
                {formErrors.email && (
                  <p className={styles.error}>{formErrors.email} </p>
                )}
              </div>

              {/* Code to get User Employee ID and Phone Number as Input*/}

              <div className={styles.comboInputs}>
                {/* Code to get User Employee ID as Input*/}
                <div className={styles.comboLabelInputs}>
                  <label
                    className={styles.registrationLabel}
                    htmlFor="employeeId"
                  >
                    Employee ID<span>*</span>
                  </label>

                  <div className={styles.inputTag}>
                    <input
                      className={`${
                        formErrors.employeeId
                          ? styles.errorInput
                          : styles.registrationInput
                      }`}
                      type="text"
                      id="employeeId"
                      name="employeeId"
                      placeholder="00000"
                      autoComplete="off"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={5}
                      value={formData.employeeId}
                      onChange={handleChange}
                      onBlur={() => handleBlur("employeeId")}
                    />

                    {/* Printing Validation Warning */}
                    <div className={styles.validationWarning}>
                      {formErrors.employeeId && (
                        <p className={styles.error}>{formErrors.employeeId} </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code to get User Phone Number as Input*/}
                <div className={styles.comboLabelInputs}>
                  <label
                    className={styles.registrationLabel}
                    htmlFor="phoneNumber"
                  >
                    Phone Number<span>*</span>
                  </label>
                  <div className={styles.inputTag}>
                    <input
                      className={`${
                        formErrors.phoneNumber
                          ? styles.errorInput
                          : styles.registrationInput
                      }`}
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      autoComplete="new-password"
                      placeholder="99999 99999"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phoneNumber")}
                    />

                    {/* Printing Validation Warning */}
                    <div className={styles.validationWarning}>
                      {formErrors.phoneNumber && (
                        <p className={styles.error}>{formErrors.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code to get User Work Location and Project Name as Input*/}
              <div className={styles.comboInputs}>
                {/* Code to get User Work Location as Input*/}
                <div className={styles.comboLabelInputs}>
                  <label
                    className={styles.registrationLabel}
                    htmlFor="location"
                  >
                    Work Location<span>*</span>
                  </label>

                  <div className={styles.inputTag}>
                    <select
                      className={`${
                        formErrors.location
                          ? styles.errorInput
                          : styles.registrationInput
                      }`}
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={() => handleBlur("location")}
                    >
                      <option value="">Select Location</option>
                      <option value="Bengaluru">Bengaluru</option>
                    </select>

                    {/* Printing Validation Warning */}
                    <div className={styles.validationWarning}>
                      {formErrors.location && (
                        <p className={styles.error}>{formErrors.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code to get User Project Name as Input*/}
                <div className={styles.comboLabelInputs}>
                  <label
                    className={styles.registrationLabel}
                    htmlFor="projectName"
                  >
                    Project Name<span>*</span>
                  </label>
                  <div className={styles.inputTag}>
                    <select
                      className={`${
                        formErrors.projectName
                          ? styles.errorInput
                          : styles.registrationInput
                      }`}
                      name="projectName"
                      id="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      onBlur={() => handleBlur("projectName")}
                    >
                      <option value="">Select Project</option>
                      {/* {projects.map((project, idx) => (
                        <option key={idx} value={project}>
                          {project}
                        </option>
                      ))} */}
                      <option value="RMG">RMG</option>
                    </select>

                    {/* Printing Validation Warning */}
                    <div className={styles.validationWarning}>
                      {formErrors.projectName && (
                        <p className={styles.error}>{formErrors.projectName}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Code to get User Password as Input*/}
              <div className={styles.comboInputs}>
                {/* Code to get User Password as Input*/}
                <div
                  className={`${styles.comboLabelInputs} ${styles.passwordLabel}`}
                >
                  <div className={styles.paswordHintIcon}>
                    <label
                      className={styles.registrationLabel}
                      htmlFor="password"
                    >
                      Enter Password<span>*</span>
                    </label>

                    <span className={styles.iconContainer}>
                      <ShieldQuestion color="grey" size={25} />
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
                  <div className={styles.inputTag}>
                    <input
                      className={`${
                        formErrors.password
                          ? styles.errorInput
                          : styles.registrationInput
                      }`}
                      type={passwordVisible1 ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                    />

                    {/* Eye icon for toggling password show or hide */}
                    <div className={styles.eyePosition}>
                      <span onClick={togglePasswordVisibility1}>
                        {passwordVisible1 ? (
                          <Eye color="grey" size={25} />
                        ) : (
                          <EyeOff color="grey" size={25} />
                        )}
                      </span>
                    </div>

                    {/* Printing Validation Warning */}
                    <div className={styles.validationWarning}>
                      {formErrors.password && (
                        <p className={styles.error}>{formErrors.password}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code to confirm User Password as Input*/}
                <div
                  className={`${styles.comboLabelInputs} ${styles.confirmPasswordLabel}`}
                >
                  <label
                    className={styles.registrationLabel}
                    htmlFor="confirmPassword"
                  >
                    Confirm Password<span>*</span>
                  </label>
                  <div className={styles.inputTag}>
                    <input
                      className={`${
                        formErrors.confirmPassword
                          ? styles.errorInput
                          : styles.registrationInput
                      }`}
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                    />

                    {/* Code to confirm User Password as Input*/}
                    <div className={styles.validationWarning}>
                      {formErrors.confirmPassword && (
                        <p className={styles.error}>
                          {formErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code for form buttons*/}
            <div className={styles.RegistrationBtn}>
              {/* Code for Submit button*/}
              <button
                className={styles.registrationSubmitBtn}
                disabled={buttonDisabled}
                style={{ cursor: buttonDisabled ? "not-allowed" : "pointer" }}
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>

            {/* Code for footer part to redirect user to login page if he is already signed up */}
            <div className={styles.formFooter}>
              <p>
                Already have an account? <a href="/login">Log in here.</a>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.videoContainer}>
          <video autoPlay loop muted>
            <source
              src="/assets/Videos/registrationVideo.mp4"
              type="video/mp4"
            />
            Browser does not support the video tag.
          </video>
        </div>

        {/* Function to Open the message alert using modal */}
        <MessageHandle
          isOpen={open}
          onClose={handleClose}
          message={message}
        ></MessageHandle>

        {/* Conditional Rendering of Toasrer Comp */}
        {/* {showToaster && (
          <Toaster
            message={modalMessage}
            setShowToaster={setShowToaster}
            heading={modalHeading}
          />
        )} */}
      </div>
    </div>
  );
};

export default RegistrationPage;
