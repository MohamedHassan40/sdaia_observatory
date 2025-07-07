'use client';

import React from 'react';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SkillsCard: React.FC<SkillsCardProps> = ({ aiKeywords, loading }) => {
  // Mock data - replace with your actual data fetching logic
  const skillsData = [
    { name: 'Machine Learning', value: 35 },
    { name: 'Python', value: 30 },
    { name: 'Data Analysis', value: 28 },
    { name: 'Neural Networks', value: 25 },
    { name: 'Natural Language Processing', value: 20 },
    { name: 'Computer Vision', value: 18 },
  ];

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
   
   
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillsData}
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
                {skillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        
      </CardContent>
    </Card>
  );
};

export default SkillsCard;