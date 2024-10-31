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
import { Company, CompanyBlog, CompanyNews, Tweet } from "@/types/global";
import Link from "next/link";
import Image from "next/image";

interface CompanyBlogsCardProps {
  CompanyBlogs: CompanyBlog[];
  company?: Company;
}

const CompanyBlogsCard: React.FC<CompanyBlogsCardProps> = ({
  CompanyBlogs,
  company,
}) => {
  console.log(CompanyBlogs);

  const sortCompanyBlogsByCreatedAt = (CompanyBlogs: any) => {
    return CompanyBlogs.sort(
      (a: any, b: any) =>
        new Date(b.news_date || "").getTime() -
        new Date(a.news_date || "").getTime()
    );
  };

  CompanyBlogs = sortCompanyBlogsByCreatedAt(CompanyBlogs);

  return (
    <Card className="overflow-hidden flex-1 " x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            Latest Company Blogs
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
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>CSV</DropdownMenuItem>
              <DropdownMenuItem>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 text-sm max-h-[400px] overflow-y-scroll">
        <div className="flex flex-col">
          {CompanyBlogs?.filter(
            (companyBlogs: CompanyBlog) => companyBlogs.title !== ""
          ).map((companyBlog: CompanyBlog) => (
            <div key={companyBlog.id} className="flex flex-row gap-4 py-1">
              <div className="flex-initial">
                <Image
                  src={companyBlog.image_url || "default.png"}
                  alt={companyBlog.title || "Company News"}
                  // fill
                  width={64}
                  height={64}
                  objectFit="fill"
                  className="rounded-lg aspect-square "
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div
                  className={`font-medium text-blue-500 line-clamp-2`}
                  dir="auto"
                >
                  {companyBlog.title}
                </div>
                <div className={`font-regular line-clamp-2`} dir="auto">
                  {companyBlog.full_text}
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <Link
                    href={`${companyBlog.blog_url}`}
                    target="_blank"
                    className="font-medium text-blue-500"
                  >
                    View
                  </Link>
                  <Separator className="w-[1px] bg-primary h-4" />
                  <p className="font-regular">
                    {new Date(companyBlog.blog_date || "").toLocaleDateString()}
                  </p>
                </div>
                <Separator className="my-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyBlogsCard;
