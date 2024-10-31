"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type Skill = {
  id: number;
  name: string;
  times_mentioned: number;
};

interface SkillsCardProps {
  aiKeywords: string[];
}

const SkillsCard: React.FC<SkillsCardProps> = ({ aiKeywords }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/getSkills?page=1');
        if (!res.ok) {
          const errorDetails = await res.text();
          throw new Error(`Error fetching data: ${res.statusText}. Details: ${errorDetails}`);
        }
        const result = await res.json();
        console.log('Fetched data in component:', result);

        if (result && Array.isArray(result.results)) {
          setSkills(result.results);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (err: any) {
        console.error("Error fetching skills data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const isAiRelated = (skillName: string) => {
    return aiKeywords.some(keyword => skillName.toLowerCase().includes(keyword.toLowerCase()));
  };

  const filteredSkills = skills.filter(skill => isAiRelated(skill.name));

  const data = {
    labels: filteredSkills.map(skill => skill.name),
    datasets: [
      {
        label: 'Times Mentioned',
        data: filteredSkills.map(skill => skill.times_mentioned),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="py-0 col-span-2" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Skills and Mentions
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
              <DropdownMenuItem onClick={() => exportToCSV(filteredSkills, 'skills')}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(filteredSkills, 'skills')}>Export JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 max-h-[400px] md:max-h-[100vh] md:h-[100vh] text-sm overflow-y-scroll">
        <Bar data={data} />
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
