import { Bar } from "react-chartjs-2";

const ReceptionAttendanceBarChart = ({
  remainingAttendeesData,
  attendeesData,
}) => {
  // Data  to be used for bar graph
  const sourceData = [
    {
      label: "Total",
      value: remainingAttendeesData + attendeesData,
    },
    {
      label: "Attendees",
      value: attendeesData,
    },
    {
      label: "Absentees",
      value: remainingAttendeesData,
    },
  ];

  return (
    // Bar graph code
    <div style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <Bar
        // Data for bar graph
        data={{
          labels: sourceData.map((data) => data.label),
          datasets: [
            {
              label: "Total Vs Attendees Vs Absentees",
              data: sourceData.map((data) => data.value),
              backgroundColor: [
                "rgba(144, 238, 144, 1)",
                "rgba(0, 238, 144, 1)",
                "rgba(255, 0, 0, 0.8)",
              ],
              borderRadius: 10,
            },
          ],
          hoverOffset: 4,
        }}
        // Animation for bar graph
        options={{
          animation: {
            onComplete: () => {
              // console.log("Animation complete");
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === "data" && context.mode === "default") {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
        }}
      />
    </div>
  );
};

export default ReceptionAttendanceBarChart;
