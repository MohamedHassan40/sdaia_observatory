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
import { Company, Product } from "@/types/global";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

const badgesMapping: any = {
  adoptive: "Adoptive-EN.svg",
  assured: "Assured-EN.svg",
  aware: "Aware-EN.svg",
  conformative: "Conformative-EN.svg",
  visionary: "Visionary-EN.svg",
  Adoptive: "Adoptive-EN.svg",
  Assured: "Assured-EN.svg",
  Aware: "Aware-EN.svg",
  Conformative: "Conformative-EN.svg",
  Visionary: "Visionary-EN.svg",
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card
      className="overflow-hidden h-full flex flex-col justify-between"
      x-chunk="dashboard-05-chunk-4"
    >
      <CardHeader className="flex py-0 px-0 flex-col items-center border-b">
        <div className="flex flex-row items-center w-full py-4 px-6">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg  ">
              {product.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-full p-6 text-sm">
        <div className="grid gap-2">
          <div className="flex flex-col gap-1 py-1">
            <div className="font-semibold"> Description</div>
            <p className="text-muted-foreground truncate-4">
              {product.description || "No description available"}
            </p>
          </div>
          <div className="flex flex-col gap-1 py-1">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-2">
              <div className="flex flex-col gap-1 items-start">
                <p className="font-medium">Company</p>
                <Link
                  href={`companies/${product.company.id}`}
                  className=" flex flex-row items-center justify-start gap-1 pt-2"
                >
                  <Image
                    src={product.company.logo_url}
                    alt={product.company.name}
                    width={32}
                    height={32}
                    className="rounded-lg bg-muted "
                  />
                  <p className="text-primary font-normal truncate-4">
                    {product.company.name}
                  </p>
                </Link>
              </div>
              {product.badge && (
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-medium">Badge</p>
                  <div className=" flex flex-row items-center justify-start gap-2 pt-2">
                    <Image
                      src={`/badges/${badgesMapping[product.badge]}`}
                      alt={product.company.name}
                      width={32}
                      height={32}
                      className=""
                    />
                    <p className="text-primary font-normal truncate-4">
                      {product.badge[0].toLocaleUpperCase() +
                        product.badge.slice(1).toLowerCase()}
                    </p>
                  </div>
                </div>
              )}
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
          href={product.product_url}
          target="_blank"
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground py-1 rounded-md px-3 flex items-center text-sm"
        >
          View More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
