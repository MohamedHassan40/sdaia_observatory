'use client';

import React from 'react';
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

const CoursesCard: React.FC<CoursesCardProps> = ({ aiKeywords, loading }) => {
  // Mock data - replace with your actual data fetching logic
  const coursesData = [
    { id: 1, name: 'Deep Learning Specialization', number: 'CS-101' },
    { id: 2, name: 'Natural Language Processing', number: 'CS-205' },
    { id: 3, name: 'Computer Vision Fundamentals', number: 'CS-310' },
  ];

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


          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Course Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursesData.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

      </CardContent>
    </Card>
  );
};

export default CoursesCard;