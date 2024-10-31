"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';

type Education = {
  id: number;
  schoolName: string;
  degree: string;
  field_of_study: string;
  start: string;
  end: string;
};

interface EducationCardProps {
  aiKeywords: string[];
}

const EducationCard: React.FC<EducationCardProps> = ({ aiKeywords }) => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch('/api/getEducation?page=1');
        if (!res.ok) {
          const errorDetails = await res.text();
          throw new Error(`Error fetching data: ${res.statusText}. Details: ${errorDetails}`);
        }
        const result = await res.json();
        console.log('Fetched data in component:', result);

        if (result && Array.isArray(result.results)) {
          setEducation(result.results);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (err: any) {
        console.error("Error fetching education data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const isAiRelated = (fieldOfStudy: string) => {
    return aiKeywords.some(keyword => fieldOfStudy.toLowerCase().includes(keyword.toLowerCase()));
  };

  const filteredEducation = education.filter(edu => isAiRelated(edu.field_of_study));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Education
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
              <DropdownMenuItem onClick={() => exportToCSV(filteredEducation, 'education')}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(filteredEducation, 'education')}>Export JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 max-h-[400px] md:max-h-[100vh] md:h-[100vh] text-sm overflow-y-scroll">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">School Name</th>
              <th className="border px-4 py-2">Degree</th>
              <th className="border px-4 py-2">Field of Study</th>
              <th className="border px-4 py-2">Start</th>
              <th className="border px-4 py-2">End</th>
            </tr>
          </thead>
          <tbody>
            {filteredEducation.map(edu => (
              <tr key={edu.id}>
                <td className="border px-4 py-2">{edu.schoolName}</td>
                <td className="border px-4 py-2">{edu.degree}</td>
                <td className="border px-4 py-2">{edu.field_of_study}</td>
                <td className="border px-4 py-2">{edu.start}</td>
                <td className="border px-4 py-2">{edu.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default EducationCard;
