import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Heart, HeartIcon, MoreVertical, Redo2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { removeUrls } from "@/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Ranking {
  title: string;
  ranking: number;
  year: number;
}

interface RankingCardProps {
  title: string;
  ranking: Ranking[];
}

const RankingsCard: React.FC<RankingCardProps> = ({ title, ranking }) => {
  return (
    <Card className="overflow-hidden flex-1 " x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            {title}
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
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>CSV</DropdownMenuItem>
              <DropdownMenuItem>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 max-h-[400px] text-sm overflow-y-scroll">
        <div className="flex flex-col w-full">
          {ranking.map((ranks: Ranking) => (
            <div key={ranks.title} className="flex flex-col gap-4 pb-4 ">
              <div className="flex flex-row gap-4 pb-1">
                <div className="flex flex-row gap-2 justify-between max-w-full flex-1">
                  <div className="flex flex-row gap-1">
                    <p className={`font-medium text-md`} dir="auto">
                      {ranks.ranking}
                      {")"}
                    </p>
                    <p
                      className={`font-medium text-md text-blue-500`}
                      dir="auto"
                    >
                      {ranks.title}
                    </p>
                  </div>
                  <p className={`font-medium text-md`} dir="auto">
                    {ranks.year}
                  </p>
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingsCard;
