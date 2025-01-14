import styles from "../styles/receptionStatistics.module.css";
import { UserCheck, UserX, Users } from "lucide-react";

const ReceptionStatistics = ({ remainingAttendeesData, attendeesData }) => {
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
  const formattedDate = `${day}/${0 + month}/${year}`;

  return (
    //   {/* summary Container - containing count of every statistics */}
    <div className={styles.receptionSummary}>
      {/* Container displaying date and day */}
      <div className={styles.statisticsCard}>
        <p>{formattedDate}</p>
        <h2>Today</h2>
        <p>{dayName}</p>
      </div>

      {/* Container displaying total attendees for the day */}
      <div className={styles.statisticsCard}>
        <Users className={styles.icons} fill="green" />
        <h3>Total Bookings : {attendeesData + remainingAttendeesData}</h3>
      </div>

      {/* booked seats statistics container */}
      <div className={styles.statisticsCard}>
        <UserCheck className={styles.icons} fill="coral" />
        <h3>Total Attendees : {attendeesData}</h3>
      </div>

      {/* booked meals statistics container */}
      <div className={styles.statisticsCard}>
        <UserX className={styles.icons} fill="#ff5400" />
        <h3>Total Absentees : {remainingAttendeesData}</h3>
      </div>
    </div>
  );
};

export default ReceptionStatistics;
