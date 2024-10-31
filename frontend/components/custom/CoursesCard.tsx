"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';

type Course = {
  id: number;
  name: string;
  number: string;
};

interface CoursesCardProps {
  aiKeywords: string[];
}

const CoursesCard: React.FC<CoursesCardProps> = ({ aiKeywords }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/getCourses?page=1');
        if (!res.ok) {
          const errorDetails = await res.text();
          throw new Error(`Error fetching data: ${res.statusText}. Details: ${errorDetails}`);
        }
        const result = await res.json();
        console.log('Fetched data in component:', result);

        if (result && Array.isArray(result.results)) {
          setCourses(result.results);
        } else {
          throw new Error("Data is not an array");
        }
      } catch (err: any) {
        console.error("Error fetching courses data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const isAiRelated = (courseName: string) => {
    return aiKeywords.some(keyword => courseName.toLowerCase().includes(keyword.toLowerCase()));
  };

  const filteredCourses = courses.filter(course => isAiRelated(course.name));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Courses
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
              <DropdownMenuItem onClick={() => exportToCSV(filteredCourses, 'courses')}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(filteredCourses, 'courses')}>Export JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 max-h-[400px] md:max-h-[100vh] md:h-[100vh] text-sm overflow-y-scroll">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.id}>
                <td className="border px-4 py-2">{course.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CoursesCard;
