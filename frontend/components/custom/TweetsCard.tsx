'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { HeartIcon, MoreVertical, Redo2, ExternalLink, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Company, Tweet } from '@/types/global';
import Link from 'next/link';
import { exportToCSV, exportToJSON } from '@/utils/exportUtils';
import { useInView } from 'react-intersection-observer';
import { fetchTweets } from '@/actions/fetch-tweets';
import { Spinner } from '../ui/spinner';
import { format } from 'date-fns';

interface TweetsCardProps {
  tweets: Tweet[];
  company?: Company;
  companyName?: string;
  title?: string;
}

const TweetsCard: React.FC<TweetsCardProps> = ({
  tweets = [],
  company,
  companyName,
  title = 'Latest Tweets',
}) => {
  const [newTweets, setNewTweets] = useState<Tweet[]>(tweets || []);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const loadMoreTweets = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = (page % 7) + 1;
      const response = await fetchTweets(nextPage);
      
      if (!response?.results || response.results.length === 0) {
        setHasMore(false);
        return;
      }

      setNewTweets((prevTweets) => [...(prevTweets || []), ...response.results]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more tweets:', error);
      setError('Failed to load more tweets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMoreTweets();
    }
  }, [inView, loadMoreTweets, isLoading, hasMore]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy · h:mm a');
    } catch {
      return format(new Date(), 'MMM d, yyyy · h:mm a');
    }
  };

  const getTwitterUrl = (tweet: Tweet) => {
    if (company?.company_twitter_id) {
      return `https://twitter.com/${company.company_twitter_id}/status/${tweet.tweet_id}`;
    }
    if (tweet.company_twitter_username) {
      return `https://twitter.com/${tweet.company_twitter_username}/status/${tweet.tweet_id}`;
    }
    return `https://twitter.com/i/status/${tweet.tweet_id}`;
  };

  const handleRetry = () => {
    setError(null);
    loadMoreTweets();
  };

  const exportTweetsData = () => {
    return newTweets.map((tweet) => ({
      id: tweet.id,
      tweet_id: tweet.tweet_id,
      full_text: tweet.full_text || '',
      favorite_count: tweet.favorite_count || 0,
      retweet_count: tweet.retweet_count || 0,
      created_at: tweet.created_at || new Date().toISOString(),
      company_twitter_username: tweet.company_twitter_username || '',
      symbols: tweet.symbols?.map(s => s.symbol).join(', ') || '',
    }));
  };

  return (
    <Card className="overflow-hidden flex-1 w-full h-full shadow-lg border-border/50">
      <CardHeader className="flex flex-row items-center border-b bg-gradient-to-r from-primary/5 to-background">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-xl font-semibold text-primary">
            {title}
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
                onClick={() => exportToCSV(exportTweetsData(), 'tweets')}
                className="cursor-pointer"
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToJSON(exportTweetsData(), 'tweets')}
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
          {newTweets
            ?.filter((tweet: Tweet) => tweet.full_text)
            .map((tweet: Tweet) => (
              <div
                key={tweet.id || tweet.tweet_id || `${tweet.created_at}-${Math.random().toString(36).substring(2, 9)}`}
                className="p-6 hover:bg-primary/5 transition-colors duration-150"
              >
                <div className="flex flex-col gap-3">
                  <p className="text-foreground whitespace-pre-line">
                    {tweet.full_text}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <HeartIcon className="h-4 w-4 text-pink-500/80" />
                        <span>{tweet.favorite_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Redo2 className="h-4 w-4 text-blue-500/80" />
                        <span>{tweet.retweet_count || 0}</span>
                      </div>
                    </div>

                    <Link
                      href={getTwitterUrl(tweet)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Tweet
                    </Link>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(tweet.created_at || new Date().toISOString())}
                    </div>
                  </div>

                  {tweet.symbols?.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="text-sm font-medium">Related hashtags:</span>
                      <div className="flex flex-wrap gap-2">
                        {tweet.symbols.map((symbol) => (
                          <Link
                            href={`https://twitter.com/search?q=%23${symbol.symbol?.slice(1)}`}
                            key={symbol.id || symbol.symbol}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {symbol.symbol}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          
          <div
            ref={ref}
            className="flex justify-center items-center p-8 min-h-[100px]"
          >
            {isLoading && <Spinner  />}
            {!hasMore && !isLoading && (
              <p className="text-muted-foreground text-sm">
                No more tweets to load
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetsCard;