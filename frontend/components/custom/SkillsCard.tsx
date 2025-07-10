'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SkillsCardProps {
  aiKeywords: string[];
  loading: boolean;
}

interface Skill {
  id: number;
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SkillsCard: React.FC<SkillsCardProps> = ({ aiKeywords, loading }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/getSkills?page=1");
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        // Assume API returns a list of skills with a 'name' and 'times_mentioned' or similar
        const skillsData = (data.results || data).map((skill: any) => ({
          id: skill.id,
          name: skill.name,
          value: skill.times_mentioned || 1,
        }));
        // Sort by value descending and take top 10
        setSkills(skillsData.sort((a: Skill, b: Skill) => b.value - a.value).slice(0, 10));
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Top AI Skills</CardTitle>
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
      <CardContent className="h-[400px]">
        {isLoading && <div>Loading skills...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!isLoading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skills}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Mentions" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              >
                {skills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;