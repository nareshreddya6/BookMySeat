import { useEffect, useRef, useState } from "react";
import styles from "../styles/adminNavbar.module.css";
import {
  Armchair,
  Bell,
  History,
  LayoutDashboard,
  MapPinned,
  Snowflake,
  Users,
  User,
  CalendarOff,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";
export const AdminNavbar = ({ onLinkClick }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("/admin/dashboard");
  const [toggle, setToggle] = useState(false);
  const navbarRef = useRef(null);

  // states to manage response message modal and message and t otoggle the toaster
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  // Function to handle navigation
  const handleClick = (link) => {
    setActiveLink(link);
    onLinkClick(link);
  };

  // Function to handle navigation to user dashboard from admin side
  const handleNavigateClick = (path) => {
    // Token from sessionStorage
    const token = sessionStorage.getItem("token");
    // Setting token to api req for authorization
    axios.defaults.headers.common["Authorization"] = token;

    // Axios req to get user role
    axios
      .get(`http://localhost:9006/bookmyseat/userInfo`)
      .then((res) => {
        // console.log(res.data.roleName);
        // Checking whether admin is user or not
        if (res.data.roleName === "ADMIN/EMPLOYEE") {
          navigate(path);
        } else {
          // alert("You are not user here");
          setModalHeading("Error");
          setModalMessage("You are not a user.");
          setShowToaster(true);
        }
      })
      // Axios error
      .catch((err) => console.log(err));
  };

  // Function to handle closing of navbaer in mobile view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to toggle navbar in mobile view
  const toggleNavbar = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log("Toggling");
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };

  return (
    // JSX Code for navbar
    <>
      {/* List item to show menu in mobile view */}
      <ul className={styles.toggleMenu}>
        <li>
          <div className={`${styles.link}`} onClick={toggleNavbar}>
            <Menu size={30} className={styles.icons} />
            <span> NavBar</span>
          </div>
        </li>
      </ul>

      {/* Navbar list */}
      <nav
        ref={navbarRef}
        className={`${styles.adminNavbar} ${toggle ? styles.toggled : ""}`}
        onClick={toggleNavbar}
      >
        <ul>
          <div>
            {/* List item to navigate to admin dashboard */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/dashboard" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/dashboard")}
              >
                <LayoutDashboard size={30} className={styles.icons} />
                <span> DashBoard</span>
              </div>
            </li>
            {/* List item to navigate to admin Action Center */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/actioncenter" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/actioncenter")}
              >
                <Bell size={30} className={styles.icons} />
                <span> Action Center</span>
              </div>
            </li>

            {/* List item to navigate to user list */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/userInfo" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/userInfo")}
              >
                <Users size={30} className={styles.icons} />
                <span> User Info</span>
              </div>
            </li>

            {/* List item to navigate to seat Mapping */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/seats" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/seats")}
              >
                <Armchair size={30} className={styles.icons} />
                <span> Seat Reservation</span>
              </div>
            </li>

            {/* List item to navigate to Shift Mapping */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/modifyshifts" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/modifyshifts")}
              >
                <History size={30} className={styles.icons} />
                <span> Modify Shifts</span>
              </div>
            </li>

            {/* List item to navigate to Add/View Locations */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/editlocations" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/editlocations")}
              >
                <MapPinned size={30} className={styles.icons} />
                <span> Edit Locations</span>
              </div>
            </li>

            {/* List item to navigate to Add/View Projects */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/editprojects" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/editprojects")}
              >
                <Snowflake size={30} className={styles.icons} />
                <span> Edit Projects</span>
              </div>
            </li>

            {/* List item to navigate to Add/View Holidays */}
            <li>
              <div
                className={`${styles.link} ${
                  activeLink === "/admin/holidays" ? styles.active : ""
                }`}
                onClick={() => handleClick("/admin/holidays")}
              >
                <CalendarOff size={30} className={styles.icons} />
                <span> Edit Holidays</span>
              </div>
            </li>
          </div>
          <div>
            {/* List item to navigate to user Dashboar if admin is also a user */}
            <li>
              <div
                className={`${styles.link}`}
                onClick={() => handleNavigateClick("/user")}
              >
                <User size={30} className={styles.icons} />
                <span> Login As User</span>
              </div>
            </li>
          </div>
        </ul>
      </nav>

      {/* Conditional rendering of toaster comp */}
      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </>
  );
};
