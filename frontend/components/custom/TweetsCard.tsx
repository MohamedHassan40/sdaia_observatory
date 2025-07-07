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
  tweets,
  company,
  companyName,
  title = 'Latest Tweets',
}) => {
  const [newTweets, setNewTweets] = useState<Tweet[]>(tweets);
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
      const newProducts = (await fetchTweets(nextPage)) ?? { results: [] };
      const newTweetData = newProducts.results || [];

      setNewTweets((prevTweets: Tweet[]) => [...prevTweets, ...newTweetData]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more tweets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading]);

  useEffect(() => {
    if (inView && !isLoading) {
      loadMoreTweets();
    }
  }, [inView, loadMoreTweets, isLoading]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy · h:mm a');
    } catch {
      return format(new Date(), 'MMM d, yyyy · h:mm a');
    }
  };

  const getTwitterUrl = (tweet: Tweet) => {
    if (company) {
      return `https://twitter.com/${company.company_twitter_id}/status/${tweet.tweet_id}`;
    }
    if (tweet.company_twitter_username) {
      return `https://twitter.com/${tweet.company_twitter_username}/status/${tweet.tweet_id}`;
    }
    return `https://twitter.com/${companyName}/status/${tweet.tweet_id}`;
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
                onClick={() => exportToCSV(newTweets, 'tweets')}
                className="cursor-pointer"
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToJSON(newTweets, 'tweets')}
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
          {newTweets
            ?.filter((tweet: Tweet) => tweet.full_text !== '')
            .map((tweet: Tweet) => (
              <div
                key={tweet.id}
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
                        <span>{tweet.favorite_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Redo2 className="h-4 w-4 text-blue-500/80" />
                        <span>{tweet.retweet_count}</span>
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
                      {formatDate(tweet.created_at)}
                    </div>
                  </div>

                  {tweet.symbols.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="text-sm font-medium">Related hashtags:</span>
                      <div className="flex flex-wrap gap-2">
                        {tweet.symbols.map((symbol) => (
                          <Link
                            href={`https://twitter.com/search?q=%23${symbol.symbol.slice(1)}`}
                            key={symbol.id}
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
            className="flex justify-center items-center p-8"
          >
            {isLoading && <Spinner className="h-8 w-8 text-primary" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetsCard;