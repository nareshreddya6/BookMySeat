import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

import styles from "../styles/loginForm.module.css";
import { useNavigate } from "react-router";
export const LoginForm = ({onLogin}) => {
  let emailRef = useRef();
  let passwordRef = useRef();
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@valtech\.com$/;

  const [emailError, setEmailError] = useState();
  const [passwordVisible, setPasswordVisible] = useState();

  const [authorizationError, setAuthorizationError] = useState();

  // function for email validation
  const handleEmail = () => {
    const isValidEmail = emailRegex.test(emailRef.current.value);
    if (!isValidEmail) {
      setEmailError("Invalid email address.");
      emailRef.current.style.borderColor = "red";
      // setIsLoginDisabled(true);
    } else {
      setEmailError("");
      emailRef.current.style.borderColor = "initial";
      // setIsLoginDisabled(false);
    }
  };
  // function to handle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // function to handle onClick() - on submit button
  const handleSubmit = () => {
    handleEmail();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // if no email error
  
    if (!emailError) {
      try {
        axios
          .post("http://localhost:9006/bookmyseat/login", {
            email,
            password,
          })
          .then((res) => {
            const token = "Bearer " + res.data.accessToken;
            sessionStorage.setItem("token", token);
            setAuthorizationError("");
            const userRole = res.data.role;
            onLogin(userRole); 
            // Redirect the user to the appropriate route based on the role if needed
            if (userRole === "EMPLOYEE") {
              navigate("/user");
            } else if (userRole === "ADMIN" || userRole === "ADMIN/EMPLOYEE") {
              navigate("/admin");
            } else if (userRole === "RECEPTIONIST") {
              navigate("/reception");
            } else if (res.data === "Account is InActive") {
              setAuthorizationError(
                "Your account is not active! Please contact the admin."
              );
            }
          })
          .catch((err) => {
            if (err.response.data === "Invalid Credentials") {
              setAuthorizationError("Please enter valid credentials");
              emailRef.current.style.borderColor = "red";
              passwordRef.current.style.borderColor = "red";
            } else if (err.response.data === "Account is InActive") {
              setAuthorizationError(
                "Your account is InActive! Contact admin for further Queries."
              );
            }
          });
      } catch {
        setAuthorizationError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    // main container for login --------------start-----------------------------------
    <div className={styles.loginContainer}>
      {/* login Card Container -------------------start----------------------------- */}
      <div className={styles.loginCard}>
        <div className={styles.imageContainer}></div>
        {/* form container */}
        {/* card heading */}
        <h2 className={styles.loginHead}>Welcome Back!</h2>
        {authorizationError ? (
          <h3 className={styles.invalidCredentials}>{authorizationError}</h3>
        ) : (
          ""
        )}
        {/* form field container -  input and label */}
        <div className={styles.formFieldsContainer}>
          <label className={styles.formLabel} htmlFor="email">
            Email
          </label>
          <input
            className={styles.formInput}
            type="email"
            id="email"
            name="email"
            placeholder="someone@xyz.com"
            ref={emailRef}
            onBlur={handleEmail}
            onChange={() => setAuthorizationError("")}
          />
          <div className={styles.emailError}>
            {emailError && (
              <span className={styles.emailError}>{emailError}</span>
            )}
          </div>
        </div>
        {/* form field container -  input and label */}
        <div
          className={`${styles.formFieldsContainer} ${styles.passwordLabel}`}
        >
          <label className={styles.formLabel} htmlFor="password">
            Password
          </label>
          <input
            className={styles.formInput}
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            ref={passwordRef}
            onChange={() => setAuthorizationError("")}
          />
          <div className={styles.eyePosition}>
            <span onClick={togglePasswordVisibility}>
              {passwordVisible ? <Eye /> : <EyeOff />}
            </span>
          </div>
        </div>
        <button onClick={handleSubmit} className={styles.loginButton}>
          Login
        </button>
        <a href="/forgot" className={styles.forgotPassword}>
          Forgot Password?
        </a>
        <hr />
        {/* redirection to signup container */}
        <div className={styles.signUpContainer}>
          <p>
            Need an account?{" "}
            <a href="/register" className={styles.signUpRedirection}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
      {/* login Card Container -------------------end----------------------------- */}
    </div>
    // main container for login --------------end-----------------------------------
  );
};
