"use client"; // Add this at the top of your file

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Heart, HeartIcon, MoreVertical, Redo2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Company, Tweet } from "@/types/global";
import Link from "next/link";
import { removeUrls } from "@/utils";
import { exportToCSV, exportToJSON } from "@/utils/exportUtils";
import { useInView } from "react-intersection-observer";
import { fetchTweets } from "@/actions/fetch-tweets";
import { Spinner } from "../ui/spinner";

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
  title = "Latest Tweets",
}) => {
  const [newTweets, setNewTweets] = useState<any>(tweets);
  const [page, setPage] = useState<number>(1);

  const { ref, inView } = useInView();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const loadMoreTweets = async () => {
  const nextPage = (page % 7) + 1;
  const newProducts = (await fetchTweets(nextPage)) ?? { results: [] };

  const newTweetData = newProducts.results || [];

  setNewTweets((prevTweets: Tweet[]) => [...prevTweets, ...newTweetData]);
  setPage(nextPage);
};


  useEffect(() => {
    if (inView) {
      console.log("In view");
      loadMoreTweets();
    }
  }, [inView]);

  return (
    <Card className="overflow-hidden flex-1 w-full h-full">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            {title}
          </CardTitle>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportToCSV(tweets, "News")}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(tweets, "News")}>
                JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 text-sm min-h-[600px] max-h-[600px] overflow-y-scroll">
        <div className="flex flex-col">
          {newTweets
            ?.filter((tweet: any) => tweet.full_text !== "")
            .map((tweet: Tweet) => (
              <div key={tweet.id} className="flex flex-col gap-2 py-1">
                <div className={`font-regular line-clamp-2`} dir="auto">
                  {tweet.full_text}
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <div className="flex flex-row gap-1 items-center">
                    <HeartIcon className="h-5 w-5" />
                    <span className="font-medium leading-10">
                      {tweet.favorite_count}
                    </span>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <Redo2 className="h-5 w-5 " />
                    <span className="font-medium leading-10">
                      {tweet.retweet_count}
                    </span>
                  </div>
                  <Separator className="w-[1px] bg-primary h-4" />
                  {company && (
                    <Link
                      href={`https://twitter.com/${company?.company_twitter_id}/status/${tweet.tweet_id}`}
                      target="_blank"
                      className="font-medium text-blue-500"
                    >
                      View Tweet
                    </Link>
                  )}
                  {!company && tweet.company_twitter_username && (
                    <Link
                      href={`https://twitter.com/${companyName}/status/${tweet.tweet_id}`}
                      target="_blank"
                      className="font-medium text-blue-500"
                    >
                      View Tweet
                    </Link>
                  )}
                  <Separator className="w-[1px] bg-primary h-4" />
                  <p className="font-regular">
                    {new Date(tweet.created_at).toLocaleString()}
                  </p>
                </div>
                {tweet.symbols.length > 0 && (
                  <div className="flex items-start flex-col">
                    <span className="font-medium leading-10">
                      Tweet Hashtags:
                    </span>
                    <div className="flex flex-row flex-wrap gap-1 items-center">
                      {tweet.symbols.map((symbol) => (
                        <Link
                          href={`https://twitter.com/search?q=%23${symbol.symbol.slice(
                            1,
                            symbol.symbol.length
                          )}`}
                          key={symbol.id}
                          className="font-medium text-blue-500"
                        >
                          {symbol.symbol}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <Separator className="my-2" />
              </div>
            ))}
        </div>
        <div
          className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
          ref={ref}
        >
          <Spinner />
        </div>
      </CardContent>
    </Card>
  );
};

export default TweetsCard;
