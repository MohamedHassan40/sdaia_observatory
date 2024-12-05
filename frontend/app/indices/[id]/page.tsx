import React from "react";
import EntityCard from "@/components/custom/EntityCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Location, Company, Tweet } from "@/types/global";
import TweetsCard from "@/components/custom/TweetsCard";
export default async function Page({ params }: { params: { id: string } }) {
  const data = await fetch(
    // `${process.env.BASE_FETCH_URL}/api/getSingleCompany?id=${params.id}`, {
    `http://35.232.23.77:8000/api/getSingleCompany?id=${params.id}`, {
      next : {revalidate: 1800}
    }
  );
  let company: Company = await data.json();

  const tweetData = await fetch(
    // `${process.env.BASE_FETCH_URL}/api/getTweetsForCompany?id=${params.id}`, {
    `http://35.232.23.77:8000/api/getTweetsForCompany?id=${params.id}`, {
      next : {revalidate: 1800}
    }
  );

  const tweets = await tweetData.json();
  const tweetsData: Tweet[] = tweets;

  return (
    <main className="flex flex-col flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="overflow-hidden w-full" x-chunk="dashboard-05-chunk-4">
        <CardHeader className="flex flex-row items-center border-b">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg ">
              <Image
                src={company.logo_url}
                alt={company.name}
                width={32}
                height={32}
                className="rounded-lg"
              />
              {company.name}
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
        <CardContent className="p-6 pb-2 text-sm">
          <div className="grid gap-2">
            <div className="flex flex-col gap-1 py-1">
              <div className="font-semibold"> Company Locations</div>
              <div className="flex flex-row flex-wrap">
                {company.locations.map((location: Location, index: number) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground w-full">
                      {location.city}, {location.country}
                    </span>
                    {location.is_headquarter && (
                      <span className="text-blue-500 ml-1">(HQ)</span>
                    )}
                    {index !== company.locations.length - 1 && (
                      <Separator className="w-[0.1rem] h-full mx-2 bg-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col gap-1 py-1">
              <div className="font-semibold"> Description</div>
              <p className="text-muted-foreground truncate-4">
                {company.description}
              </p>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col gap-1 py-1">
              <div className="font-semibold"> Overview</div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-2">
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-medium">Total Employees</p>
                  <p className="text-muted-foreground truncate-4">
                    {company.employee_count}
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-medium">Founded Year</p>
                  <p className="text-muted-foreground truncate-4">
                    {company.founded_year}
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-medium">Website</p>
                  <Link
                    className="text-blue-500 truncate-4"
                    href={company.website_url}
                    target="_blank"
                  >
                    Visit Website
                  </Link>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-medium">Linkedin</p>
                  <Link
                    className="text-blue-500 truncate-4"
                    href={`https://www.linkedin.com/company/${company.linkedin_username}`}
                    target="_blank"
                  >
                    Visit Linkedin
                  </Link>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-medium">Linkedin Follower Count</p>
                  <p className="text-muted-foreground truncate-4">
                    {company.follower_count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2024-5-2">2 May, 2024</time>
          </div>
          <Link
            href={`/companies/${company.name}`}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-1 rounded-md px-3 flex items-center text-sm"
          >
            View More
          </Link>
        </CardFooter>
      </Card>
      <div className="grid grid-cols-1 w-full sm:grid-cols-2 gap-4">
        <TweetsCard tweets={tweetsData} company={company} />
        <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-center border-b">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg ">
                News and Updates
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
          <CardContent className="p-6 pb-2 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col gap-1 py-1">
                <div className="font-semibold"> Sample</div>
                <p className="text-muted-foreground truncate-4">Sample</p>
              </div>
              <Separator className="my-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-center border-b">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg ">
                Jobs
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
          <CardContent className="p-6 pb-2 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col gap-1 py-1">
                <div className="font-semibold"> Sample</div>
                <p className="text-muted-foreground truncate-4">Sample</p>
              </div>
              <Separator className="my-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-center border-b">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg ">
                Blog
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
          <CardContent className="p-6 pb-2 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col gap-1 py-1">
                <div className="font-semibold"> Sample</div>
                <p className="text-muted-foreground truncate-4">Sample</p>
              </div>
              <Separator className="my-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden flex-1" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-center border-b">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg ">
                Products
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
          <CardContent className="p-6 pb-2 text-sm">
            <div className="grid gap-2">
              <div className="flex flex-col gap-1 py-1">
                <div className="font-semibold"> Sample</div>
                <p className="text-muted-foreground truncate-4">Sample</p>
              </div>
              <Separator className="my-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
