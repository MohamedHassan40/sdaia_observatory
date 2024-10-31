"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';

type Experience = {
  id: number;
  title: string;
  company: string;
  start: string;
  end: string;
  location: string;
  employment_type: string;
};

interface ExperienceCardProps {
  aiKeywords: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ aiKeywords }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch('/api/getExperiences?page=1');
        if (!res.ok) {
          const errorDetails = await res.text();
          throw new Error(`Error fetching data: ${res.statusText}. Details: ${errorDetails}`);
        }
        const result = await res.json();
        console.log('Fetched data in component:', result);

        if (result && Array.isArray(result.results)) {
          setExperiences(result.results);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (err: any) {
        console.error("Error fetching experiences data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const isAiRelated = (experienceTitle: string) => {
    return aiKeywords.some(keyword => experienceTitle.toLowerCase().includes(keyword.toLowerCase()));
  };

  const filteredExperiences = experiences.filter(exp => isAiRelated(exp.title));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Work Experience
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
              <DropdownMenuItem onClick={() => exportToCSV(filteredExperiences, 'experiences')}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(filteredExperiences, 'experiences')}>Export JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 max-h-[400px] md:max-h-[100vh] md:h-[100vh] text-sm overflow-y-scroll">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Start</th>
              <th className="border px-4 py-2">End</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Employment Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredExperiences.map(exp => (
              <tr key={exp.id}>
                <td className="border px-4 py-2">{exp.title}</td>
                <td className="border px-4 py-2">{exp.start}</td>
                <td className="border px-4 py-2">{exp.end}</td>
                <td className="border px-4 py-2">{exp.location}</td>
                <td className="border px-4 py-2">{exp.employment_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
