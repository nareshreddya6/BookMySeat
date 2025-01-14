import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

export const FourWheelerParkingChart = ({ data }) => {
  const sourceData = [
    {
      label: "4 Wheeler Parking Space Available",
      value: data.fourWheelerParkingSpace - data.fourWheelerParkingSpaceBooked,
    },
    {
      label: "4 Wheeler Parking Space Booked",
      value: data.fourWheelerParkingSpaceBooked,
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
                label: "4 Wheeler Parking Space",
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
