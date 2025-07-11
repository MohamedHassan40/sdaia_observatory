'use client';

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/custom/ProductCard";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/getProducts?page=1`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        let arr = data.results || data;
        if (!Array.isArray(arr)) {
          setError("API did not return a list of products.");
          setProducts([]);
        } else {
          setProducts(arr);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <main className="p-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {products.length === 0 && <div>No Products found.</div>}
      {products.map((product: any) => (
        <div key={product.id} className="rounded-xl shadow-lg bg-white dark:bg-muted flex flex-col overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl border border-gray-200 dark:border-gray-700">
          <ProductCard product={product} />
        </div>
      ))}
    </main>
  );
};

export default ProductsPage;
