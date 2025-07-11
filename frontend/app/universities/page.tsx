'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLineChart } from "@/components/charts/LineChart";
import { ArticlesAndCitationsPerYear } from "@/constants/openAlexConstants";
import Image from "next/image";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  news_url: string;
  image_url: string;
  news_date?: string;
  date_time_pub?: string;
  created_at?: string;
  source?: string;
}

interface Education {
  id: number;
  schoolName: string;
  degree: string;
  field_of_study: string;
  start: string;
  end: string;
}

const UniversitiesPage = () => {
  // OECD News
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Pagination for OECD news
  const [newsPage, setNewsPage] = useState(1);
  const newsPerPage = 10;

  // University aggregation from employee education
  const [universityCounts, setUniversityCounts] = useState<{ [key: string]: number }>({});
  const [eduLoading, setEduLoading] = useState(true);
  const [eduError, setEduError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // Fetch all pages of OECD news
    const fetchAllNews = async () => {
      setNewsLoading(true);
      setNewsError(null);
      let allNews: NewsItem[] = [];
      let page = 1;
      let hasNext = true;
      try {
        while (hasNext) {
          const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news?page=${page}`
        );
          if (!res.ok) throw new Error("Failed to fetch news");
          const data = await res.json();
          const pageNews = (data.results || data).filter((item: any) =>
            item.title?.toLowerCase().includes("oecd") || item.source_title?.toLowerCase().includes("oecd")
          );
          allNews = allNews.concat(pageNews);
          hasNext = !!data.next;
          page++;
        }
        setNews(allNews);
      } catch (err: any) {
        setNewsError(err.message || "Unknown error");
      } finally {
        setNewsLoading(false);
      }
    };
    fetchAllNews();
  }, []);

  useEffect(() => {
    // Fetch education data and aggregate universities
    const fetchEducation = async () => {
      setEduLoading(true);
      setEduError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/education?page=${page}`
        );
        if (!res.ok) throw new Error("Failed to fetch education");
        const data = await res.json();
        const education = data.results || data;
        const counts: { [key: string]: number } = {};
        education.forEach((edu: Education) => {
          if (edu.schoolName) {
            counts[edu.schoolName] = (counts[edu.schoolName] || 0) + 1;
          }
        });
        setUniversityCounts(counts);
      } catch (err: any) {
        setEduError(err.message || "Unknown error");
      } finally {
        setEduLoading(false);
      }
    };
    fetchEducation();
  }, []);

  return (
    <main className="p-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle>Saudi Arabia AI Publications Trend (OpenAlex)</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart data={ArticlesAndCitationsPerYear.data} />
          </CardContent>
        </Card>
      </div>
      {/* OECD News Section */}
      <div className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle>OECD AI News</CardTitle>
          </CardHeader>
          <CardContent>
            {newsLoading && <div>Loading OECD news...</div>}
            {newsError && <div className="text-red-500">{newsError}</div>}
            {!newsLoading && !newsError && news.length === 0 && <div>No OECD news found.</div>}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {news.slice((newsPage - 1) * newsPerPage, newsPage * newsPerPage).map((item) => {
                // Robust date handling: prefer date_time_pub, then news_date, then created_at
                let dateStr = item.date_time_pub || item.news_date || item.created_at || null;
                let formattedDate = dateStr ? new Date(dateStr).toISOString().slice(0, 10) : "No date";
                return (
                  <div
                    key={item.id}
                    className="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition h-full w-full"
                  >
                    <div className="flex gap-4 items-center h-full w-full">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-bold text-md text-blue-700 line-clamp-2">{item.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{item.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{formattedDate}</div>
                        <div className="mt-2">
                          <a
                            href={item.news_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold"
                            style={{ pointerEvents: 'auto' }}
                          >
                            View Article
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Pagination controls */}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold disabled:opacity-50"
                onClick={() => setNewsPage(newsPage + 1)}
                disabled={newsPage * newsPerPage >= news.length}
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* University Aggregation Section */}
      <div className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle>Universities Attended by Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {eduLoading && <div>Loading university data...</div>}
            {eduError && <div className="text-red-500">{eduError}</div>}
            {!eduLoading && !eduError && Object.keys(universityCounts).length === 0 && <div>No university data found.</div>}
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(universityCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <div key={name} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-start">
                    <div className="font-bold text-md">{name}</div>
                    <div className="text-xs text-muted-foreground">{count} employee{count > 1 ? 's' : ''}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UniversitiesPage;
