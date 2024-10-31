// components/MyLineChart.tsx
"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { useTheme } from "next-themes";

interface ChartData {
  data: {
    labels: string[]
    datasets: {
      label: string;
      data: number[] | any;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      spanGaps?: boolean;
    }[];
  };
  displayLegend?: boolean;
  reverseYAxis?: boolean;
  reverseXAxis?: boolean;
}

export const CustomLineChart: React.FC<ChartData> = ({
  data,
  displayLegend = true,
  reverseYAxis = false,
  reverseXAxis = false,
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
    scales: {
      y: {
        reverse: reverseYAxis,
      },
      x: {
        reverse: reverseXAxis,
      },
    },
    // Add any other options here as needed
  };

  const { theme } = useTheme();

  const darkLineOneBorder = "rgba(255, 255, 255, 1)";
  const darkLineOneBackground = "rgba(255, 255, 255, 1)";

  const lightLineOneBorder = "rgba(28, 53, 94, 1)";
  const lightLineOneBackground = "rgba(28, 53, 94, 1)";

  let newData = data.datasets.map((dataset, index) => {
    const randomLineBorder = `rgba(${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, 1)`;

    return {
      ...dataset,
      borderColor:
        theme === "dark"
          ? index === 0
            ? darkLineOneBorder
            : randomLineBorder
          : index === 0
          ? lightLineOneBorder
          : randomLineBorder,

      backgroundColor:
        theme === "dark"
          ? index === 0
            ? darkLineOneBackground
            : randomLineBorder
          : index === 0
          ? lightLineOneBackground
          : randomLineBorder,
    };
  });

  data.datasets = newData;

  return (
    <Line updateMode="reset" redraw={true} options={options} data={data} />
  );
};
