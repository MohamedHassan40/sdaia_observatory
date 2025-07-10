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

const NewsCard: React.FC<NewsCardProps> = ({ news = [] }) => {
  const [newNews, setNewNews] = useState<News[]>(news || []);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const loadMoreNews = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = (page % 7) + 1;
      const response = await fetchNews(nextPage);
      
      if (!response?.results || response.results.length === 0) {
        setHasMore(false);
        return;
      }

      setNewNews((prevNews) => [...(prevNews || []), ...response.results]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more news:', error);
      setError('Failed to load more news. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMoreNews();
    }
  }, [inView, loadMoreNews, isLoading, hasMore]);

  const exportNewsData = () => {
    return newNews.map((item) => ({
      title: item.title || 'No title',
      body: item.body || 'No content',
      url: item.url || '#',
      date_time_pub: item.date_time_pub || new Date().toISOString(),
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy · h:mm a');
    } catch {
      return format(new Date(), 'MMM d, yyyy · h:mm a');
    }
  };

  const handleRetry = () => {
    setError(null);
    loadMoreNews();
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
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 flex flex-col items-center justify-center gap-2">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        )}
        <div className="flex flex-col w-full divide-y divide-border/50">
          {newNews?.map((newsItem: News) => (
            newsItem && (
              <div
                key={newsItem.url || `${newsItem.title}-${Math.random().toString(36).substring(2, 9)}`}
                className="p-6 hover:bg-primary/5 transition-colors duration-150"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-lg leading-tight text-foreground">
                    {newsItem.title || 'Untitled Article'}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {newsItem.body || 'No content available'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Link
                      href={newsItem.url || '#'}
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
            )
          ))}
          <div
            ref={ref}
            className="flex justify-center items-center p-8 min-h-[100px]"
          >
            {isLoading && <Spinner className="h-8 w-8 text-primary" />}
            {!hasMore && !isLoading && (
              <p className="text-muted-foreground text-sm">
                No more news to load
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;