import styles from "../styles/adminDashboardStatistics.module.css";
import {
  Armchair,
  CookingPot,
  MonitorCheck,
  ParkingSquare,
  Users,
} from "lucide-react";

export const AdminDashboardStatistics = ({ data }) => {
  //Extracting todays date and day
  const today = new Date();
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayIndex = today.getDay();
  const dayName = weekdays[dayIndex];

  const day = String(today.getDate());
  const month = String(today.getMonth());
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <>
      {/* summary Container - containing count of every statistics */}
      <div className={styles.summary}>
        {/* Container displaying date and day */}
        <div className={`${styles.statisticsHead} ${styles.statisticsCard}`}>
          <p>{formattedDate}</p>
          <h1>Today</h1>
          <p>{dayName}</p>
        </div>
        {/* Container displaying total attendees for the day */}
        <div
          className={`${styles.markedAttendedStatistics} ${styles.statisticsCard}`}
        >
          <Users className={styles.icons} fill="green" />
          <h2>Attendees : {data.totalAttendees}</h2>
        </div>
        {/* container containing the remaing statistics */}
        <div className={styles.otherStatistics}>
          {/* booked seats statistics container */}
          <div
            className={`${styles.seatsStatistics}  ${styles.statisticsCard}`}
          >
            <Armchair className={styles.icons} fill="coral" />
            <h4>Seats Booked : {data.totalSeatsBooked}</h4>
          </div>
          {/* booked meals statistics container */}
          <div
            className={`${styles.lunchStatistics}  ${styles.statisticsCard}`}
          >
            <CookingPot className={styles.icons} fill="#ff5400" />
            <h4>Meals Booked : {data.totalEmployeesOptedForLunch}</h4>
          </div>
          {/* parking booked statistics container */}
          <div
            className={`${styles.parkingStatistics}  ${styles.statisticsCard}`}
          >
            <ParkingSquare className={styles.icons} stroke="#a877ea" />
            <h4>Parking Booked : {data.totalParkingSpaceBooked}</h4>
          </div>
          {/* additional desktops statistics container */}
          <div
            className={`${styles.additionalDesktopStatistics}  ${styles.statisticsCard}`}
          >
            <MonitorCheck className={styles.icons} stroke="#86bbd8" />
            <h4>Desktops : {data.totalEmployeesOptedForDesktop}</h4>
          </div>
        </div>
      </div>
    </>
  );
};
