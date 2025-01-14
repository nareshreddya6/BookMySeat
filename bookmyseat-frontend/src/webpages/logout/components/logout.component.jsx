import React, { useState } from "react";
import styles from "../styles/logout.module.css";
import { useNavigate } from "react-router-dom";

export default function Logout({ setActiveComponent, setActiveLink }) {
  const navigate = useNavigate();


  const handleNavigate = () => {
    setActiveLink("/user/dashboard");
    setActiveComponent("/user/dashboard");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.replace("/login");
    // navigate('/login')
  };
  return (
    <div className={styles.logout}>
      <div className={styles.logoutcontainer}>
        <div className={styles.logoutcontent}>
          <p className={styles.logoutp}>Are you sure you want to logout?</p>
          <div className={styles.logoutbtn}>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={handleNavigate}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}
