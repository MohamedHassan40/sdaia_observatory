"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { data } from "@/constants/staticData";
import StatCard from "./StatCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/utils/exportUtils";

const StatisticsCard = () => {
  return (
    <Card className="overflow-hidden w-full" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            KSA Statistics
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportToCSV(data, "statistics")}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToJSON(data, "statistics")}
              >
                JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <ul className="grid grid-cols-2 gap-3">
            {data.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2024-8-14">14 August, 2024</time>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatisticsCard;
