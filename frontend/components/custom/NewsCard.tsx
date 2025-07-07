'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { MoreVertical, ExternalLink, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { News } from '@/types/global';
import Link from 'next/link';
import { fetchNews } from '@/actions/fetch-news';
import { useInView } from 'react-intersection-observer';
import { Spinner } from '../ui/spinner';
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';
import { format } from 'date-fns';

interface NewsCardProps {
  news: News[];
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [newNews, setNewNews] = useState<News[]>(news);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const loadMoreTweets = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const nextPage = (page % 7) + 1;
      const newProducts = (await fetchNews(nextPage)) ?? [];
      const newNewsData = newProducts.results;

      setNewNews((prevNews: News[]) => [...prevNews, ...newNewsData]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  useEffect(() => {
    if (inView && !isLoading) {
      loadMoreTweets();
    }
  }, [inView, loadMoreTweets, isLoading]);

  const exportNewsData = () => {
    return newNews.map((item) => ({
      title: item.title,
      body: item.body,
      url: item.url,
      date_time_pub: item.date_time_pub,
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy · h:mm a');
    } catch {
      return format(new Date(), 'MMM d, yyyy · h:mm a');
    }
  };

  return (
    <Card className="overflow-hidden relative flex-1 max-h-full shadow-lg border-border/50">
      <CardHeader className="flex flex-row items-center border-b bg-gradient-to-r from-primary/5 to-background">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-xl font-semibold text-primary">
            Latest AI News
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-primary/10"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-medium">
                Export Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => exportToCSV(exportNewsData(), 'ai-news')}
                className="cursor-pointer"
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToJSON(exportNewsData(), 'ai-news')}
                className="cursor-pointer"
              >
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto h-[600px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div className="flex flex-col w-full divide-y divide-border/50">
          {newNews?.map((newsItem: News) => (
            <div
              key={newsItem.url}
              className="p-6 hover:bg-primary/5 transition-colors duration-150"
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-lg leading-tight text-foreground">
                  {newsItem.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                  {newsItem.body}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Link
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Read full article
                  </Link>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(newsItem.date_time_pub || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div
            ref={ref}
            className="flex justify-center items-center p-8"
          >
            {isLoading && <Spinner className="h-8 w-8 text-primary" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;