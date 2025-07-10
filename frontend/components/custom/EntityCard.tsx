import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { data } from "@/constants/staticData";
import { Company } from "@/types/global";
import Image from "next/image";
import Link from "next/link";
import ImageWithFallback from "../ui/ImageWithFallback";
import { sanitizeLinkedInUrl, getImageFallback, logImageError } from "@/utils/imageUtils";

interface EntityCardProps {
  company: Company;
}

const EntityCard: React.FC<EntityCardProps> = ({ company }) => {
  // Handle LinkedIn URLs properly - they might contain special characters
  const coverImageUrl = sanitizeLinkedInUrl(company.cover_image_url || getImageFallback('cover'));
  const logoUrl = sanitizeLinkedInUrl(company.logo_url || getImageFallback('logo'));

  // Debug logging for LinkedIn URLs
  if (company.cover_image_url?.includes('licdn.com')) {
    console.log('LinkedIn cover URL:', {
      original: company.cover_image_url,
      sanitized: coverImageUrl
    });
  }
  
  if (company.logo_url?.includes('licdn.com')) {
    console.log('LinkedIn logo URL:', {
      original: company.logo_url,
      sanitized: logoUrl
    });
  }

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col flex-grow-0 justify-between">
        <CardHeader className="flex py-0 px-0 flex-col items-center border-b">
          <div className="h-32 relative flex w-full">
            <ImageWithFallback
              src={coverImageUrl}
              fallbackSrc={getImageFallback('cover')}
              alt={`${company.name} cover image`}
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <div className="flex flex-row items-center w-full py-4 px-6">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                {logoUrl && (
                  <div className="relative w-8 h-8">
                    <ImageWithFallback
                      src={logoUrl}
                      fallbackSrc={getImageFallback('logo')}
                      alt={`${company.name} logo`}
                      objectFit="cover"
                      className="rounded-lg bg-muted w-8 h-8"
                    />
                  </div>
                )}
                {company.name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pb-2 text-sm">
          <div className="grid gap-2">
            <div className="flex flex-col gap-1 py-1">
              <div className="font-semibold"> Headquarters</div>
              <div className="flex flex-row flex-wrap gap-2">
                {company.locations
                  .filter((location) => location.is_headquarter)
                  .map((location) => {
                    console.log(location);
                    if (location) {
                      return (
                        <div
                          key={location.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground w-full">
                            {location.city}, {location.country}
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key="no-headquarters"
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground w-full">
                            NO HEADQUARTERS
                          </span>
                        </div>
                      );
                    }
                  })}
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
                    href={company.website_url || " "}
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
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated{" "}
            <time dateTime={new Date().toUTCString()}>
              {new Date().toLocaleDateString()}
            </time>
          </div>
          <Link
            href={`/companies/${company.id}`}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-1 rounded-md px-3 flex items-center text-sm"
          >
            View More
          </Link>
        </CardFooter>
      </Card>
    </>
  );
};

export default EntityCard;
