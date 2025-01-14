import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

export const SeatsChart = ({ data }) => {
  const sourceData = [
    {
      label: "Seats booked",
      value: data.totalSeatsBooked,
    },
    {
      label: "Seats Available",
      value: data.totalSeatsAvailable,
    },
  ];
  return (
    <>
      <div>
        <Doughnut
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Seats",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(255, 0, 0, 0.8)",
                  "rgba(217, 237, 146, 1)",
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
