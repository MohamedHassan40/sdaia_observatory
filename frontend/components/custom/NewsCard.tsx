'use client';
import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { News } from "@/types/global";
import Link from "next/link";
import { fetchNews } from "@/actions/fetch-news";
import { useInView } from "react-intersection-observer";
import { Spinner } from "../ui/spinner";
import { exportToCSV, exportToJSON } from "@/utils/exportUtils";

interface NewsCardProps {
  news: News[];
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [newNews, setNewNews] = useState<News[]>(news);
  const [page, setPage] = useState<number>(1);

  const { ref, inView } = useInView();

  // Memoize loadMoreTweets using useCallback
  const loadMoreTweets = useCallback(async () => {
    const nextPage = (page % 7) + 1; // Ensure nextPage cycles through pages
    console.log("Next page", nextPage);

    const newProducts = (await fetchNews(nextPage)) ?? [];
    const newNewsData = newProducts.results;

    setNewNews((prevNews: News[]) => [...prevNews, ...newNewsData]);
    setPage(nextPage);
  }, [page]); // page is now a dependency of loadMoreTweets

  useEffect(() => {
    if (inView) {
      console.log("In view");
      loadMoreTweets();
    }
  }, [inView, loadMoreTweets]); // loadMoreTweets is now added to the dependency array

  const exportNewsData = () => {
    const dataToExport = news.map((item) => ({
      title: item.title,
      body: item.body,
      url: item.url,
      date_time_pub: item.date_time_pub,
    }));
    return dataToExport;
  };

  return (
    <Card className="overflow-hidden relative flex-1 max-h-full">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            Latest AI News
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
              <DropdownMenuItem
                onClick={() => exportToCSV(exportNewsData(), "News")}
              >
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToJSON(exportNewsData(), "News")}
              >
                Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 text-sm overflow-y-scroll max-h-[600px]">
        <div className="flex flex-col w-full">
          {newNews?.map((newsItem: News) => (
            <div key={newsItem.url} className="flex flex-col gap-4 pb-4 ">
              <div className="flex flex-row gap-4 pb-1">
                <div className="flex flex-col gap-2 max-w-full flex-1">
                  <p className={`font-bold text-md`} dir="auto">
                    {newsItem.title}
                  </p>
                  <p
                    className={`font-regular line-clamp-2 overflow-x-hidden`}
                    dir="auto"
                  >
                    {newsItem.body}
                  </p>
                  <div className="flex flex-row gap-2 items-center">
                    <Link
                      href={`${newsItem.url}`}
                      target="_blank"
                      className="font-medium text-blue-500"
                    >
                      View News
                    </Link>
                    <Separator className="w-[1px] bg-primary h-4" />
                    <div className={`font-regular line-clamp-2 `} dir="auto">
                      {new Date(
                        newsItem.date_time_pub || "05-02-2024"
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
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

export default NewsCard;
