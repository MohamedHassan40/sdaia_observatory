"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

import { useTheme } from "next-themes";

interface ChartData {
  data: {
    labels: string[];
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
}

export const CustomBarChart: React.FC<ChartData> = ({
  data,
  displayLegend = true,
  reverseYAxis = false,
}) => {
  const { theme } = useTheme();

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: displayLegend,
      },
      datalabels: {
        anchor: 'center' as const,
        align: 'center' as const,
        color: theme === 'dark' ? 'white' : 'black',
        formatter: (_value: any, context: any) => context.chart.data.labels[context.dataIndex],
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: false,
        reverse: reverseYAxis,
      },
    },
  };

  const themeColors = {
    dark: {
      border: "rgba(255, 255, 255, 1)",
      background: "rgba(255, 255, 255, 0.1)"
    },
    light: {
      border: "rgba(0, 0, 0, 1)",
      background: "rgba(0, 0, 0, 0.1)"
    }
  };

  let newData = data.datasets.map((dataset, index) => {
    const baseColor = theme === 'dark' ? themeColors.dark : themeColors.light;

    return {
      ...dataset,
      borderColor: index === 0 ? baseColor.border : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      backgroundColor: index === 0 ? baseColor.background : `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`
    };
  });

  data.datasets = newData;

  return (
    <Bar updateMode="reset" redraw={true} options={options} data={data} />
  );
};
