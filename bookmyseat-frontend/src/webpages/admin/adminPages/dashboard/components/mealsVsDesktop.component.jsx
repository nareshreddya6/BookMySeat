import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

export const MealsVsDesktop = ({ data }) => {
  const sourceData = [
    {
      label: "Meals booked",
      value: data.totalEmployeesOptedForLunch,
    },
    {
      label: "Additional Desktops Booked",
      value: data.totalEmployeesOptedForDesktop,
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
                label: "Meals Vs Desktops",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(252, 243, 0, 1)",
                  "rgba(42, 157, 143, 1)",
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
