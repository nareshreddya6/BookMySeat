import { useEffect, useRef, useState } from "react";
import styles from "../styles/userNavbar.module.css";
import {
  History,
  LayoutDashboard,
  ArmchairIcon,
  CalendarOff,
  Menu,
} from "lucide-react";

export const UserNavbar = ({ activeLink, setActiveLink, onLinkClick }) => {
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
        className={`${styles.userNavbar} ${toggle ? styles.toggled : ""}`}
        onClick={toggleNavbar}
      >
        <ul>
          {/* List item to navigate to user dashboard */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/user/dashboard" ? styles.active : ""
              }`}
              onClick={() => handleClick("/user/dashboard")}
            >
              <LayoutDashboard size={30} className={styles.icons} />
              <span> DashBoard</span>
            </div>
          </li>

          {/* List item to navigate to user seat booking Page */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/user/bookaseat" ? styles.active : ""
              }`}
              onClick={() => handleClick("/user/bookaseat")}
            >
              <ArmchairIcon size={30} className={styles.icons} />
              <span> Book Seat</span>
            </div>
          </li>

          {/* List item to navigate to user booking history */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/user/bookinghistory" ? styles.active : ""
              }`}
              onClick={() => handleClick("/user/bookinghistory")}
            >
              <History size={30} className={styles.icons} />
              <span> Booking History</span>
            </div>
          </li>

          {/* List item to navigate to user holidays */}
          <li>
            <div
              className={`${styles.link} ${
                activeLink === "/user/holidays" ? styles.active : ""
              }`}
              onClick={() => handleClick("/user/holidays")}
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
