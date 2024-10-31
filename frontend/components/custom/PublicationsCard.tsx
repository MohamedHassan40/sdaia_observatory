"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Heart, HeartIcon, MoreVertical, Redo2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Authorship, Publication, Institution } from "@/types/global";

// interface NewsCardProps {
//   news: News[];
// }

const PublicationsCard = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getWorks?page=${page}`, {
          next: { revalidate: 1800 },
        });
        if (!response.ok) {
          throw new Error("Something went wrong while fetching News");
        }
        const data = await response.json();
        setPublications((prevPublications: Publication[]) => {
          const existingIds = new Set(
            prevPublications.map((c: Publication) => c.id)
          );
          const newPublications = data?.results?.filter(
            (c: any) => !existingIds.has(c.id)
          );
          return [...prevPublications, ...newPublications];
        });
      } catch (err: any) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  return (
    <Card className="overflow-hidden flex-1 " x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            Latest AI Works
          </CardTitle>
        </div>
        {/* <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>CSV</DropdownMenuItem>
              <DropdownMenuItem>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </CardHeader>
      <CardContent className="p-6 pb-2 max-h-[400px] md:max-h-[100vh] md:h-[100vh] text-sm overflow-y-scroll">
        <div className="flex flex-col w-full">
          {publications.map((publication: Publication) => (
            <div key={publication.id} className="flex flex-col gap-4 pb-4 ">
              <div className="flex flex-row gap-4 pb-1">
                {/* {news.image && (
                  <div className="flex relative flex-col">
                    <Image
                      src={news.image || "default.png"}
                      alt={news.title || "AI News"}
                      // fill
                      width={64}
                      height={64}
                      className="rounded-lg aspect-square"
                    />
                  </div>
                )} */}
                <div className="flex flex-col gap-2 max-w-full flex-1">
                  <p className={`font-bold text-md`} dir="auto">
                    {publication.title}
                  </p>
                  <div className="flex flex-col gap-2 items-start justify-between">
                    <div className="flex flex-row gap-2 items-center">
                      <Link
                        href={`${publication.doi}`}
                        target="_blank"
                        className="font-medium text-blue-500"
                      >
                        View Publication
                      </Link>
                      <Separator className="w-[1px] bg-primary h-4" />
                      <div className={`font-regular line-clamp-2 `} dir="auto">
                        {new Date(
                          publication.publication_date || "05-02-2024"
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-col flex-wrap">
                      {publication.authorships.map((authorship: Authorship) => {
                        return (
                          <div
                            key={
                              authorship.raw_author_name ||
                              authorship.author?.id
                            }
                          >
                            {authorship.institutions?.map(
                              (institution: Institution) => {
                                // Check if the institution's country code is "SA"
                                if (institution.country_code === "SA") {
                                  return (
                                    <div
                                      key={institution.id}
                                      className="flex flex-row gap-2 items-center"
                                    >
                                      {/* Display the institution name */}
                                      <Link
                                        href={`${institution.id}`}
                                        target="_blank"
                                        className="font-medium text-blue-500"
                                      >
                                        {institution.display_name
                                          .split(" ")
                                          .map((word: any) => {
                                            if (
                                              word.toLowerCase() === "of" ||
                                              word.toLowerCase() === "and" ||
                                              word.toLowerCase() === "the" ||
                                              word.toLowerCase() === "bin" ||
                                              word.toLowerCase() === "bint"
                                            ) {
                                              return "";
                                            }
                                            return word.charAt(0).toUpperCase();
                                          })
                                          .join("")}
                                      </Link>
                                      <Separator className="w-[1px] bg-primary h-4" />

                                      {/* Display the author's name */}
                                      <span className="text-gray-600">
                                        {authorship.raw_author_name ||
                                          authorship.author?.display_name}
                                      </span>
                                    </div>
                                  );
                                }

                                return null; // Do not render anything if the institution is not from "SA"
                              }
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationsCard;
