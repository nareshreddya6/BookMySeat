import { useEffect, useRef, useState } from "react";
import styles from "../styles/receptionNavbar.module.css";
import { Bell, LayoutDashboard, Users, CalendarOff, Menu } from "lucide-react";
export const ReceptionNavBar = ({ onLinkClick }) => {
  const [activeLink, setActiveLink] = useState("/reception/dashboard");
  // State to toggle navbar in mobile view
  const [toggle, setToggle] = useState(false);
  // Reference for the navbar
  const navbarRef = useRef(null);

  // Function to make the nabar hide during mobile view
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

    // Function for navigation
  const handleClick = (link) => {
    setActiveLink(link);
    onLinkClick(link);
  };
  
  // Function to Toggle navbar in mobile css
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
        className={`${styles.receptionNavbar} ${toggle ? styles.toggled : ""}`}
        onClick={toggleNavbar}
      >
        <ul>
          {/* List item to navigate to reception dashboard */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/reception/dashboard" ? styles.active : ""
              }`}
              onClick={() => handleClick("/reception/dashboard")}
            >
              <LayoutDashboard size={30} className={styles.icons} />
              <span> DashBoard</span>
            </div>
          </li>

          {/* List item to navigate to reception mark attendance page */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/reception/markattendance" ? styles.active : ""
              }`}
              onClick={() => handleClick("/reception/markattendance")}
            >
              <Bell size={30} className={styles.icons} />
              <span> Mark Attendance</span>
            </div>
          </li>

          {/* List item to navigate to reception attendee List page */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/reception/attendeelist" ? styles.active : ""
              }`}
              onClick={() => handleClick("/reception/attendeelist")}
            >
              <Users size={30} className={styles.icons} />
              <span> Attendee List</span>
            </div>
          </li>

          {/* List item to navigate to reception holidays */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/reception/holidays" ? styles.active : ""
              }`}
              onClick={() => handleClick("/reception/holidays")}
            >
              <CalendarOff size={30} className={styles.icons} />
              <span> Holidays</span>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};
