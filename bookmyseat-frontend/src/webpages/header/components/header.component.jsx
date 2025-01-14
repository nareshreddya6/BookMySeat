import { CircleUser } from "lucide-react";
import styles from "../styles/header.module.css";
import { useState } from "react";
const Header = ({ user, activeLink, setActiveLink, onLinkClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  const handleHeaderClick = (link) => {
    setActiveLink(`/${user}${link}`);
    onLinkClick(`/${user}${link}`);
  };

  return (
    <div className={styles.topHeader}>
      <img src="/assets/Images/valtech_logo.png" alt="valtech_logo" />

      <div
        className={styles.profileIcon}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CircleUser size={50} />
        {isMenuOpen && (
          <div className={styles.dropDown}>
            <div className={styles.triangle}></div>
            <div className={styles.dropdownMenu}>
              <ul>
                <li onClick={() => handleHeaderClick("/profile")}>
                    View Profile
                </li>
                <li onClick={() => handleHeaderClick("/changepassword")}>                  
                    Change Password
                </li>
                <li onClick={() => handleHeaderClick("/logout")}>
                    Log Out
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
