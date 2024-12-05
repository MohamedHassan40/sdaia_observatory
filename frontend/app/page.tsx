import Link from "next/link";
import React from "react";
import StatisticsCard from "@/components/custom/StatisticsCard";
import NewsCard from "@/components/custom/NewsCard";
import TweetsCard from "@/components/custom/TweetsCard";
import IndicesCard from "@/components/custom/IndicesCard";
import { fetchTweets } from "@/actions/fetch-tweets";
import { fetchNews } from "@/actions/fetch-news";

export default async function Page() {
  const tweets = await fetchTweets(1);
  const tweetsData = tweets?.results || []; // Fallback to empty array

  const news = await fetchNews(1);
  const newsData = news?.results || []; // Fallback to empty array

  return (
    <main className="flex flex-col flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <div className="flex flex-col w-full gap-4 pt-6 border-b pb-6">
        <h1 className="text-lg md:text-3xl font-semibold">
          Saudi Arabia AI Observatory
        </h1>
      </div>
      <IndicesCard />
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
        <NewsCard news={newsData} />
        <TweetsCard tweets={tweetsData} title="Latest AI Related Tweets" />
      </div>
      <StatisticsCard />
    </main>
  );
}

