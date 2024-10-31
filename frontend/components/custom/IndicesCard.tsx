"use client";
import React, { useState } from "react";
import {
  SaudiCountryProfileOxfordInsights,
  OxfordOverallScoreTrend,
  TortoiseGlobalAIIndexTrend,
} from "@/constants/chartConstants";
import { CustomLineChart } from "../charts/LineChart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import Link from "next/link";

const IndicesCard = () => {
  const [showAllOxfordData, setShowAllOxfordData] = useState(false);
  const [showAllTortoiseData, setShowAllTortoiseData] = useState(false);

  const handleOxfordClick = () => {
    setShowAllOxfordData(!showAllOxfordData);
  };

  const handleTortoiseClick = () => {
    setShowAllTortoiseData(!showAllTortoiseData);
  };

  const oxfordFilteredData = {
    labels: OxfordOverallScoreTrend.data.labels,
    datasets: showAllOxfordData
      ? OxfordOverallScoreTrend.data.datasets.filter(
          (dataset) => dataset.label !== "Overall Score"
        )
      : OxfordOverallScoreTrend.data.datasets.filter(
          (dataset) => dataset.label === "Overall Score"
        ),
  };

  const tortoiseFilteredData = {
    labels: TortoiseGlobalAIIndexTrend.data.labels,
    datasets: showAllTortoiseData
      ? TortoiseGlobalAIIndexTrend.data.datasets.filter(
          (dataset) => dataset.label !== "Overall Score"
        )
      : TortoiseGlobalAIIndexTrend.data.datasets.filter(
          (dataset) => dataset.label === "Overall Score"
        ),
  };
  return (
    <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Oxford Insights Government AI Readiness Index (2021-2023)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomLineChart data={oxfordFilteredData} />
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full flex justify-between">
            <button onClick={handleOxfordClick}>
              {showAllOxfordData ? "Hide Details" : "Show Details"}
            </button>

            <Link href={SaudiCountryProfileOxfordInsights.link} target="_blank">
              View Full Report
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Tortoise Global AI Index (2021-2023)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomLineChart data={tortoiseFilteredData} />
        </CardContent>
        <CardFooter>
          <CardDescription className="w-full flex justify-between">
            <button onClick={handleTortoiseClick}>
              {showAllTortoiseData ? "Hide Details" : "Show Details"}
            </button>
            <Link href={TortoiseGlobalAIIndexTrend.link} target="_blank">
              View Full Report
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IndicesCard;
