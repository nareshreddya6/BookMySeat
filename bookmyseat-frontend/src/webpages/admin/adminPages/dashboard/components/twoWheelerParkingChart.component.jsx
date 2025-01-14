import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

export const TowWheelerParkingChart = ({ data }) => {
  const sourceData = [
    {
      label: "2 Wheeler Parking Space Available",
      value: data.twoWheelerParkingSpace - data.twoWheelerParkingSpaceBooked,
    },
    {
      label: "2 Wheeler Parking Space Booked",
      value: data.twoWheelerParkingSpaceBooked,
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
                label: "2 Wheeler Parking Space",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(162, 214, 249, 1)",
                  "rgba(255, 0, 0, 0.8)",
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
