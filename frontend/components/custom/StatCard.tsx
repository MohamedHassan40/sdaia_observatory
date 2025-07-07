import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  item: {
    name: string;
    value: string | number;
    details: string;
    link?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
  };
}

const StatCard = ({ item }: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:bg-primary/5">
      <div className="flex h-full flex-col items-center gap-4 text-center">
        {/* Header with optional icon */}
        <div className="flex flex-col items-center gap-2">
          {item.icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
              {item.icon}
            </div>
          )}
          <h3 className="text-lg font-medium text-muted-foreground">{item.name}</h3>
        </div>

        {/* Main value with optional trend indicator */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-bold text-foreground">
            {item.value}
          </span>
          {item.trend && (
            <span className={`inline-flex items-center text-sm font-medium ${
              item.trend === 'up' ? 'text-green-500' : 
              item.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          {item.details}
        </p>

        {/* Link with nice hover effect */}
        {item.link && (
          <Link
            href={item.link}
            className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:text-primary/80 hover:underline"
            target="_blank"
          >
            View details
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -left-5 -bottom-5 h-16 w-16 rounded-full bg-secondary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};

export default StatCard;