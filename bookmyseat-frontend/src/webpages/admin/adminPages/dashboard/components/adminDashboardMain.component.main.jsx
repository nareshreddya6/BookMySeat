import { useEffect, useState } from "react";
import styles from "../styles/adminDashboardMain.module.css";
import { AdminDashboardStatistics } from "./adminDashboardStatistics.component";
import { SeatsChart } from "./seatsChart.component";
import { AttendeesVsSeats } from "./attendeesVsSeatsChart.component";
import { OverallStatistics } from "./overallStatisticsChart.component";
import { FourWheelerParkingChart } from "./fourWheelerParkingChart.component";
import { TowWheelerParkingChart } from "./twoWheelerParkingChart.component";
import { MealsVsDesktop } from "./mealsVsDesktop.component";
import axios from "axios";
import Toaster from "../../../../toaster/components/toaster.component";

export const DashboardMain = () => {
  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  // state to store data
  const [data, setData] = useState({
    totalAttendees: 0,
    totalSeatsBooked: 0,
    totalSeatsAvailable: 534,
    totalParkingSpaceAvailable: 0,
    totalParkingSpaceBooked: 0,
    fourWheelerParkingSpace: 10,
    twoWheelerParkingSpace: 40,
    fourWheelerParkingSpaceBooked: 0,
    twoWheelerParkingSpaceBooked: 0,
    totalEmployeesOptedForLunch: 0,
    totalEmployeesOptedForDesktop: 0,
  });
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("http://localhost:9006/bookmyseat/admin/dashboard")
      .then((res) => {
        const data = res.data;
        // console.log(res);
        setData((prevState) => ({
          ...prevState,
          totalAttendees: data.totalAttendees,
          totalSeatsBooked: data.totalSeatsBooked,
          totalParkingSpaceBooked: data.totalParkingSpaceBooked,
          fourWheelerParkingSpaceBooked: data.fourWheelerParkingSpaceBooked,
          twoWheelerParkingSpaceBooked: data.twoWheelerParkingSpaceBooked,
          totalEmployeesOptedForLunch: data.totalEmployeesOptedForLunch,
          totalEmployeesOptedForDesktop: data.totalEmployeesOptedForDesktop,
        }));
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage("Something went wrong!. Please try again.");
        setShowToaster(true);
      });
  }, []);
  return (
    <div style={{ backgroundColor: "rgba(112, 128, 144, 0.7)" }}>
      <AdminDashboardStatistics data={data} />
      <div className={styles.statisticsCharts}>
        <div>
          <OverallStatistics data={data} />
        </div>
        <div>
          <AttendeesVsSeats data={data} />
        </div>
        <div>
          <MealsVsDesktop data={data} />
        </div>
        <div>
          <FourWheelerParkingChart data={data} />
        </div>
        <div>
          <SeatsChart data={data} />
        </div>
        <div>
          <TowWheelerParkingChart data={data} />
        </div>
      </div>
      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </div>
  );
};
