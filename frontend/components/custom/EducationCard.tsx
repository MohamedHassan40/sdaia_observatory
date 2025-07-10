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

interface EducationCardProps {
  aiKeywords: string[];
  loading: boolean;
}

interface Education {
  id: number;
  schoolName: string;
  degree: string;
  field_of_study: string;
  start: string;
  end: string;
}

const EducationCard: React.FC<EducationCardProps> = ({ aiKeywords, loading }) => {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/getEducation?page=1');
        if (!res.ok) throw new Error('Failed to fetch education');
        const data = await res.json();
        setEducation(data.results || data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEducation();
  }, []);

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
        {isLoading && <div>Loading education...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!isLoading && !error && (
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
              {education.map((edu) => (
                <TableRow key={edu.id}>
                  <TableCell className="font-medium">{edu.schoolName}</TableCell>
                  <TableCell>{edu.degree}</TableCell>
                  <TableCell>{edu.field_of_study}</TableCell>
                  <TableCell>{edu.start} - {edu.end}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationCard;