import { useState } from "react";
import styles from "./adminMain.module.css";
import { AdminNavbar } from "./verticalNav/components/adminNavbar.component";
import { DashboardMain } from "./dashboard/components/adminDashboardMain.component.main";
import Header from "../../header/components/header.component";
import Locations from "./locationComp/components/location.component";
import ActionCenter from "./actionCenter/components/actionCenter.component";
import { ModifySeatsMain } from "./reserveSeats/components/modifySeatsMain.component";
import Projects from "./projectComp/components/project.component";
import Profile from "../../profile/components/profile.component";
import ChangePassword from "../../changePassword/components/changePassword.component";
import Logout from "../../logout/components/logout.component";
import Holidays from "./holidaysComp/components/holiday.component";
import UserInfo from "./userDetails/components/userInfo.component";
import ModifyShiftsMain from "./shiftsComp/components/modifyShiftMain.component";

export default function AdminMain() {
  // state to store active component
  const [activeComponent, setActiveComponent] = useState("/admin/dashboard");
  const [activeLink, setActiveLink] = useState("/admin/dashboard");

  // Function to handle click on navbar links and set the active component
  const handleLinkClick = (component) => {
    setActiveComponent(component);
  };

  // Render the active component based on the state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "/admin/dashboard":
        return <DashboardMain />;
      case "/admin/actioncenter":
        return <ActionCenter />;
      case "/admin/seats":
        return <ModifySeatsMain />;
      case "/admin/modifyshifts":
        return <ModifyShiftsMain />;
      case "/admin/editlocations":
        return <Locations />;
      case "/admin/userInfo":
        return <UserInfo />;
      case "/admin/editprojects":
        return <Projects />;
      case "/admin/holidays":
        return <Holidays />;
      case "/admin/profile":
        return <Profile />;
      case "/admin/changepassword":
        return <ChangePassword />;
      case "/admin/logout":
        return <Logout />;
      default:
        return null;
    }
  };
  return (
    <>
      <Header
        user="admin"
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        onLinkClick={handleLinkClick}
      />
      <div className={styles.mainContainer}>
        <div>
          <AdminNavbar
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
