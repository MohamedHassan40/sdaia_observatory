'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CoursesCardProps {
  aiKeywords: string[];
  loading: boolean;
}

interface Course {
  id: number;
  name: string;
  number?: string;
}

const CoursesCard: React.FC<CoursesCardProps> = ({ aiKeywords, loading }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses?page=${page}`
        );
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.results || data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">AI Courses</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            View All
            <ChevronDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div>Loading courses...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!isLoading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Course Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.number || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CoursesCard;