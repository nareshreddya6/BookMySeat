import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

export const AttendeesVsSeats = ({ data }) => {
  const sourceData = [
    {
      label: "Booked Seats, Yet No Attendees",
      value: data.totalSeatsBooked - data.totalAttendees,
    },
    {
      label: "The Day's Aggregate Attendance",
      value: data.totalAttendees,
    },
  ];
  return (
    <>
      <div>
        <Bar
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Seats Vs Attendees",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(255, 0, 0, 0.8)",
                  "rgba(144, 238, 144, 1)",
                ],
                borderRadius: 10,
              },
            ],
            hoverOffset: 4,
          }}
        />
      </div>
    </>
  );
};
