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

interface EducationCardProps {
  aiKeywords: string[];
  loading: boolean;
}

const EducationCard: React.FC<EducationCardProps> = ({ aiKeywords, loading }) => {
  // Mock data - replace with your actual data fetching logic
  const educationData = [
    {
      id: 1,
      schoolName: 'Tech University',
      degree: 'MSc',
      field_of_study: 'Artificial Intelligence',
      start: '2018',
      end: '2020'
    },
    {
      id: 2,
      schoolName: 'State College',
      degree: 'BSc',
      field_of_study: 'Computer Science',
      start: '2014',
      end: '2018'
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">AI Education</CardTitle>
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
                <TableHead>School</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Field of Study</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {educationData.map((edu) => (
                <TableRow key={edu.id}>
                  <TableCell className="font-medium">{edu.schoolName}</TableCell>
                  <TableCell>{edu.degree}</TableCell>
                  <TableCell>{edu.field_of_study}</TableCell>
                  <TableCell>{edu.start} - {edu.end}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
};

export default EducationCard;