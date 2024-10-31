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
import { Company, CompanyProduct } from "@/types/global";
import Link from "next/link";
import Image from "next/image";

interface CompanyProductCardProps {
  CompanyProducts: CompanyProduct[];
  company?: Company;
}

const CompanyProductsCard: React.FC<CompanyProductCardProps> = ({
  CompanyProducts,
  company,
}) => {
  return (
    <Card className="overflow-hidden flex-1 " x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-center border-b">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg ">
            Latest Company Products
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
          {CompanyProducts?.filter(
            (CompanyProduct) => CompanyProduct.title !== ""
          ).map((companyProduct: CompanyProduct) => (
            <div key={companyProduct.id} className="flex flex-row gap-4 py-1">
              {companyProduct.image_url && (
                <div className="flex-initial flex justify-center items-center relative w-20 h-20 border-muted border-2 rounded-md">
                  <Image
                    src={companyProduct.image_url || "default.png"}
                    alt={companyProduct.title || "Company News"}
                    fill
                    // width={64}
                    // height={64}
                    objectFit="contain"
                    className="rounded-lg aspect-square "
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 flex-1">
                <div
                  className={`font-medium text-blue-500 line-clamp-2`}
                  dir="auto"
                >
                  {companyProduct.title}
                </div>
                <div className={`font-regular line-clamp-2`} dir="auto">
                  {companyProduct.description}
                </div>

                <div className="flex flex-row gap-2 items-center">
                  <Link
                    href={`${companyProduct.product_url}`}
                    target="_blank"
                    className="font-medium text-blue-500"
                  >
                    View
                  </Link>
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

export default CompanyProductsCard;
