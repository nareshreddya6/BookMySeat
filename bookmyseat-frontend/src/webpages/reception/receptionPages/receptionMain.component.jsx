import { useState } from "react";
import styles from "./receptionMain.module.css";
import MarkAttendance from "./markAttendance/components/markAttendance.component";
import AttendeeList from "./checkAttendees/components/attendeeList.component";
import { ReceptionNavBar } from "./verticalNav/components/receptionNavbar.component";
import Header from "../../header/components/header.component";
import Logout from "../../logout/components/logout.component";
import Profile from "../../profile/components/profile.component";
import ChangePassword from "../../changePassword/components/changePassword.component";
import { ReceptionDashBoardMain } from "./receptionDashboard/components/receptionDashboardMain.component";
import ReceptionHolidays from "../receptionPages/holidaysComp/components/viewHolidays.component"

export default function ReceptionMain() {
  // state to store active component
  const [activeComponent, setActiveComponent] = useState(
    "/reception/dashboard"
  );
  const [activeLink, setActiveLink] = useState("/reception/dashboard");

  // Function to handle click on navbar links and set the active component
  const handleLinkClick = (component) => {
    setActiveComponent(component);
  };

  // Render the active component based on the state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "/reception/dashboard":
        return <ReceptionDashBoardMain />;
      case "/reception/markattendance":
        return <MarkAttendance />;
      case "/reception/attendeelist":
        return <AttendeeList />;
        case "/reception/holidays":
          return <ReceptionHolidays />;
      case "/reception/profile":
        return <Profile />;
      case "/reception/changepassword":
        return <ChangePassword />;
      case "/reception/logout":
        return <Logout />;
      default:
        return null;
    }
  };
  return (
    <>
      <Header
        user="reception"
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLinkClick={handleLinkClick}
      />
      <div className={styles.mainContainer}>
        <div>
          <ReceptionNavBar
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
