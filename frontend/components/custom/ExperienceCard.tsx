"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ArrowUpRight, BadgeCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Experience = {
  id: number;
  title: string;
  company: string;
  start: string;
  end: string;
  location: string;
  employment_type: string;
  description?: string;
};

interface ExperienceCardProps {
  aiKeywords: string[];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ aiKeywords }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/experience?page=${page}`
        );
        if (!res.ok) throw new Error('Failed to fetch experiences');
        const result = await res.json();
        setExperiences(result.results || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const isAiRelated = (text: string) => {
    return aiKeywords.some(keyword => 
      new RegExp(keyword, 'i').test(text)
    );
  };

  const filteredExperiences = experiences.filter(exp => 
    isAiRelated(exp.title) || isAiRelated(exp.company)
  );

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <span>AI Work Experience</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
       
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[30%]">Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperiences.map((exp) => (
                <React.Fragment key={exp.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleExpand(exp.id)}
                  >
                   
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>
                      {exp.start} - {exp.end || 'Present'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {exp.employment_type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {expandedId === exp.id && exp.description && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-muted/10 p-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                              {exp.description}
                            </p>
                          </div>
                          <div className="w-40">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Location:</span> {exp.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        
      </CardContent>
      {filteredExperiences.length > 0 && (
        <CardFooter className="justify-center py-3 border-t">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ExperienceCard;