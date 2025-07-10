"use client";
import EntityCard from "@/components/custom/EntityCard";
import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Company, Product } from "@/types/global";
import { FileBadge, ScanBarcode } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAIProducts, setTotalAIProducts] = useState<number>(0);
  const [totalBadges, setTotalBadges] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/?page=${page}`, {

          next: { revalidate: 1800 },
        });
        if (!response.ok) {
          throw new Error("Something went wrong while fetching products");
        }
        const data = await response.json();
        setCount(data.count);
        setTotalAIProducts(data.results.total_ai_products);
        setTotalBadges(data.results.total_badges);
        setProducts((prevProducts) => {
          const existingIds = new Set(prevProducts.map((c) => c.id));

          const newProducts = data?.results?.results?.filter(
            (c: any) => !existingIds.has(c.id)
          );
          if (!newProducts) {
            return prevProducts;
          }
          return [...prevProducts, ...newProducts];
        });
        console.log(data);
      } catch (err: any) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  return (
    <main className="flex flex-col items-center w-full justify-center gap-8 pb-8">
      <div className="w-full items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card
          className="overflow-hidden h-full w-full  flex flex-col justify-between"
          x-chunk="dashboard-05-chunk-4"
        >
          <CardHeader className="flex py-0 px-0 flex-col items-center border-b">
            <div className="flex flex-row items-center w-full py-4 px-6">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg  ">
                  Product Statistics
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 flex flex-row  text-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 justify-between items-center w-full gap-4">
              <ProductStatCard
                title="Total Number of Products"
                number={count}
                icon={ScanBarcode}
              />
              <ProductStatCard
                title="Total Number of AI Products"
                number={totalAIProducts}
                icon={ScanBarcode}
              />
              <ProductStatCard
                title="Total Number of Badges"
                number={totalBadges}
                icon={FileBadge}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3"></CardFooter>
        </Card>
      </div>
      <div className="grid auto-rows-max items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2 ">
        {error && <div className="text-red-500">{error}</div>}
        {products.length > 0
          ? products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          : !loading && <div>No Products found.</div>}

        {loading && <div>Loading...</div>}
      </div>
      {products.length < count && (
        <Button
          onClick={() => setPage(page + 1)}
          className="mb-4"
          disabled={loading}
        >
          Load More
        </Button>
      )}
    </main>
  );
};

export default ProductsList;

const ProductStatCard = ({ title, number, icon: Icon }: any) => {
  return (
    <div className="flex flex-col items-center py-4 w-full bg-muted/40 rounded-lg mx-auto">
      <div className="flex flex-col items-center justify-between h-full gap-2 w-full p-4 max-w-[90%]">
        <Icon className="h-8 w-8" />
        <p className="font-semibold text-lg text-center text-foreground pt-4">
          {number}
        </p>
        <p className="font-light text-muted-foreground text-sm leading-relaxed text-center">
          {title}
        </p>
      </div>
    </div>
  );
};
