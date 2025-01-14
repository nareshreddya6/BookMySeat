import { Line, PolarArea } from "react-chartjs-2";

// Component to display statistics comparing booked seats with actual attendees for the day
export const OverallStatistics = ({ data }) => {
  // Prepare data for the chart
  const sourceData = [
    {
      label: "Booked Seats",
      value: data.totalSeatsBooked,
    },
    {
      label: "The Day's Aggregate Attendance",
      value: data.totalAttendees,
    },
    {
      label: "Total Desktops Opted",
      value: data.totalEmployeesOptedForDesktop,
    },
    {
      label: "Total Meals booked for today",
      value: data.totalEmployeesOptedForLunch,
    },
    {
      label: "Total Parking Space booked for today",
      value: data.totalParkingSpaceBooked,
    },
  ];

  return (
    <div>
      {/* Render a line chart to visualize the comparison */}
      <PolarArea
        data={{
          labels: sourceData.map((data) => data.label),
          datasets: [
            {
              label: "Today's Statistics",
              data: sourceData.map((data) => data.value),
              backgroundColor: [
                "rgba(255, 0, 0, 0.8)",
                "rgba(144, 238, 144, 1)",
                "rgba(42, 157, 143, 1)",
                "rgba(252, 243, 0, 0.7)",
                "rgba(162, 214, 249, 1)",
              ],
              borderRadius: 10,
            },
          ],
        }}
        options={{
          animations: {
            tension: {
              duration: 1000,
              easing: "linear",
              from: 1,
              to: 0,
              loop: true,
            },
          },
        }}
      />
    </div>
  );
};
