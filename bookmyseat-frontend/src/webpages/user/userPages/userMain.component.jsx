import { useEffect, useState } from "react";
import styles from "./userMain.module.css";
import Header from "../../header/components/header.component";
import DashBoard from "./userDashboard/components/dashboard.component";
import BookMySeat from "./seatBooking/components/bookingForm.component";
import BookingHistory from "./bookingHistory/components/bookingHistory.component";
import { UserNavbar } from "./verticalNav/components/userNavbar.component";
import Profile from "../../profile/components/profile.component";
import Logout from "../../logout/components/logout.component";
import ChangePassword from "../../changePassword/components/changePassword.component";
import UserHolidays from "./holidaysComp/components/viewHolidays.component";

export default function UserMain() {
  // state to store active component
  const [activeComponent, setActiveComponent] = useState("/user/dashboard");
  const [activeLink, setActiveLink] = useState("/user/dashboard");
  const [userInformation, setUserInformation] = useState([]);

  // Function to handle click on navbar links and set the active component
  const handleLinkClick = (component) => {
    setActiveComponent(component);
  };

  // Render the active component based on the state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "/user/dashboard":
        return <DashBoard setUserInformation={setUserInformation} />;
      case "/user/bookaseat":
        return (
          <BookMySeat
            setActiveComponent={setActiveComponent}
            setActiveLink={setActiveLink}
            userInformation={userInformation}
          />
        );
      case "/user/bookinghistory":
        return <BookingHistory />;
      case "/user/holidays":
        return <UserHolidays />;
      case "/user/profile":
        return <Profile />;
      case "/user/changepassword":
        return <ChangePassword />;
      case "/user/logout":
        return <Logout  setActiveComponent={setActiveComponent}
        setActiveLink={setActiveLink} />;
      default:
        return null;
    }
  };
  return (
    <>
      <Header
        user="user"
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLinkClick={handleLinkClick}
      />
      <div className={styles.mainContainer}>
        <div>
          <UserNavbar
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            onLinkClick={handleLinkClick}
          />
        </div>
        <div>{renderActiveComponent()}</div>
      </div>
    </>
  );
}
