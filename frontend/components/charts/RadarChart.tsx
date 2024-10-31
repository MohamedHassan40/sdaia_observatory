// components/MyLineChart.tsx
"use client";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  scales,
} from "chart.js";
import { useTheme } from "next-themes";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ChartData {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  displayLegend?: boolean;
}

export const CustomRadarChart: React.FC<ChartData> = ({
  data,
  displayLegend = true,
}) => {
  const options = {
    plugins: {
      legend: {
        display: displayLegend, // This hides the legend
      },
      datalabels: {
        display: false,
      },
    },
    // Add any other options here as needed
  };

  const { theme } = useTheme();
  let newData = data.datasets.map((dataset) => {
    return {
      ...dataset,
      borderColor:
        theme === "dark" ? "rgba(255, 255, 255, 1)" : "rgba(28, 53, 94, 1)",
      backgroundColor:
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(28, 53, 94, 0.2)",
    };
  });

  data.datasets = newData;

  return (
    <Radar updateMode="reset" redraw={true} options={options} data={data} />
  );
};
