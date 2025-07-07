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
import { MoreVertical, RefreshCw, Download } from "lucide-react";
import { exportToCSV, exportToJSON } from "@/utils/exportUtils";
import { format } from "date-fns";

const StatisticsCard = () => {
  const lastUpdated = new Date("2024-8-14");

  return (
    <Card className="overflow-hidden w-full shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center border-b bg-gradient-to-r from-primary/5 to-background">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-xl font-semibold text-primary">
            KSA Statistics Dashboard
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Refresh
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => exportToCSV(data, "ksa-statistics")}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                CSV Format
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToJSON(data, "ksa-statistics")}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                JSON Format
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/30 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Last updated: <time dateTime={lastUpdated.toISOString()}>
            {format(lastUpdated, "MMMM d, yyyy")}
          </time>
        </div>
        <div className="text-xs text-muted-foreground">
          {data.length} metrics displayed
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatisticsCard;