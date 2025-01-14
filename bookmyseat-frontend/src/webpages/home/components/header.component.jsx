import { useEffect, useState } from "react";
import styles from "../styles/header.module.css";

export const Header = () => {
  // state to hold active links information
  const [activeLink, setActiveLink] = useState(null);
  // click on logo
  const redirectHome = () => {
    window.scrollTo(0, 0);
  };
  // clicking any link
  const handleClick = (link) => {
    setActiveLink(link === activeLink ? null : link);
  };
  // state to hold header visibility
  const [isVisible, setIsVisible] = useState(true);

  // functionality for header to hide and show at 400px - window height
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    // header container
    <div className={`${styles.header} ${isVisible ? "" : styles.hidden}`}>
      {/* logo container */}
      <div className={styles.logo} onClick={redirectHome}>
        <img src="/assets/Images/valtech_logo.png" alt="Logo" />
      </div>
      {/* links Container */}
      <div className={styles.linksContainer}>
        <div
          className={`${styles.links}`}
        >
          <a href="/login" onClick={() => handleClick("login")}>
            Login / Register
          </a>
        </div>
      </div>
    </div>
  );
};
