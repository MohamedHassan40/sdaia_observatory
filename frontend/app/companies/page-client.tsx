"use client";
import EntityCard from "@/components/custom/EntityCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Company } from "@/types/global";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Landmark,
  Link,
  BadgeCheckIcon,
  HandCoins,
  FlagOff,
} from "lucide-react";

const CompaniesList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalVerifiedCompanies, setTotalVerifiedCompanies] =
    useState<number>(0);
  const [totalPublicCompanies, setTotalPublicCompanies] = useState<number>(0);
  const [totalPrivateCompanies, setTotalPrivateCompanies] = useState<number>(0);
  const [totalNonProfitCompanies, setTotalNonProfitCompanies] =
    useState<number>(0);
  const [totalNotSpecifiedCompanies, setTotalNotSpecifiedCompanies] =
    useState<number>(0);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getCompanies?page=${page}`, {
          next: { revalidate: 1800 },
        });
        if (!response.ok) {
          throw new Error("Something went wrong while fetching companies");
        }
        const data = await response.json();
        setCount(data.count);
        setTotalVerifiedCompanies(data.results.total_verified_companies);
        setTotalPublicCompanies(data.results.total_public_companies);
        setTotalPrivateCompanies(data.results.total_private_companies);
        setTotalNonProfitCompanies(data.results.total_nonprofit_companies);
        setTotalNotSpecifiedCompanies(
          data.results.total_not_specified_companies
        );

        setCompanies((prevCompanies) => {
          const existingIds = new Set(prevCompanies.map((c) => c.id));

          const newCompanies = data?.results?.results?.filter(
            (c: any) => !existingIds.has(c.id)
          );
          if (!newCompanies) {
            return prevCompanies;
          }
          return [...prevCompanies, ...newCompanies];
        });
      } catch (err: any) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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
                  Company Statistics
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 flex flex-row  text-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-between items-center w-full gap-4">
              <CompanyStatCard
                title="Public Companies"
                number={totalPublicCompanies}
                icon={Landmark}
              />
              <CompanyStatCard
                title="Private Companies"
                number={totalPrivateCompanies}
                icon={Building2}
              />
              <CompanyStatCard
                title="Non-Profit Companies"
                number={totalNonProfitCompanies}
                icon={HandCoins}
              />
              <CompanyStatCard
                title="Verified Companies"
                number={totalVerifiedCompanies}
                icon={BadgeCheckIcon}
              />
              <CompanyStatCard
                title="Not Specified Companies"
                number={totalNotSpecifiedCompanies}
                icon={FlagOff}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3"></CardFooter>
        </Card>
      </div>
      <div className="grid auto-rows-max flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2 ">
        {error && <div className="text-red-500">{error}</div>}
        {companies.length > 0
          ? companies.map((company: Company) => (
              <EntityCard key={company.id} company={company} />
            ))
          : !loading && <div>No companies found.</div>}

        {loading && <div>Loading...</div>}
      </div>
      {companies.length < count && (
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

export default CompaniesList;

const CompanyStatCard = ({ title, number, icon: Icon }: any) => {
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
