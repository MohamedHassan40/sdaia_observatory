import Link from "next/link";
import {
  Home as HomeIcon,
  ListFilter,
  MoreVertical,
  Table,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatisticsCard from "@/components/custom/StatisticsCard";
import { CustomRadarChart } from "@/components/charts/RadarChart";
import {
  SaudiCountryProfileTortoise,
  SaudiCountryProfileOxfordInsights,
  SaudiAITalentConcentrationByGenderLineChart,
  AITalentSkillRankingsLineChart,
  AISkills2022,
  SaudiGithubAIProjects,
} from "@/constants/chartConstants";
import NewsCard from "@/components/custom/NewsCard";
import { CustomLineChart } from "@/components/charts/LineChart";
import RankingsCard from "@/components/custom/RankingsCard";
import { ArticlesAndCitationsPerYear } from "@/constants/openAlexConstants";
import {
  convertArticlesToLineChartData,
  convertTopicsToBarChartData,
} from "@/utils/openAlex";
import { CustomBarChart } from "@/components/charts/VerticalBarChart";
import PublicationsCard from "@/components/custom/PublicationsCard";

const Fields = [
  {
    title: "Computer Vision",
    value: "1",
  },
  {
    title: "Control Thoery and Engineering",
    value: "2",
  },
  {
    title: "Data Mining",
    value: "3",
  },
  {
    title: "Human-Computer Interaction",
    value: "4",
  },
  {
    title: "Graphics and Multimedia",
    value: "5",
  },
  {
    title: "Information Management and Retrieval",
    value: "6",
  },
  {
    title: "Machine Learning",
    value: "7",
  },
  {
    title: "Mathematical Optimization",
    value: "8",
  },
  {
    title: "Natural Language Processing and Linguistics",
    value: "9",
  },
  {
    title: "Real-Time Computing",
    value: "10",
  },
  {
    title: "Simulation",
    value: "11",
  },
  {
    title: "Speech Recognition",
    value: "12",
  },
  {
    title: "Theoretical Computing",
    value: "13",
  },
];

export default async function Home() {
  const topicsData = await fetch(
    `http://35.232.23.77:8000/api/getHotTopics`,
    {
      next: { revalidate: 1800 },
    }
  );
  const topics = await topicsData.json();
  const groupedTopics = convertTopicsToBarChartData(topics);

  const articlesGrowthData = await fetch(
    `http://35.232.23.77:8000/api/getArticleGrowth`,
    {
      next: { revalidate: 1800 },
    }
  );

  const articlesGrowth = await articlesGrowthData.json();

  const groupedArticles = convertArticlesToLineChartData(articlesGrowth);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <Card x-chunk="dashboard-05-chunk-1" className="py-0 col-span-2">
            <CardHeader className="">
              <CardDescription>
                <Link href="https://openalex.org" target="_blank">
                  Open Alex
                </Link>
              </CardDescription>
              <CardTitle className="text-xl">
                Saudi Arabia AI Publications Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomLineChart
                data={groupedArticles}
                reverseXAxis
                displayLegend={false}
              />
            </CardContent>
            <CardFooter className="font-medium flex-col items-start gap-4">
              <p className="text-xs">
                The chart shows the number of articles under the topic AI per
                year in Saudi Arabia.
              </p>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1" className="py-0 col-span-2">
            <CardHeader className="">
              <CardDescription>
                <Link href="https://openalex.org" target="_blank">
                  Open Alex
                </Link>
              </CardDescription>
              <CardTitle className="text-xl">
                Top AI Research Topics KSA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomBarChart data={groupedTopics} displayLegend={false} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 lg:col-span-1">
        {/* <StatisticsCard /> */}
        {/* <NewsCard /> */}
        <PublicationsCard />
      </div>
    </main>
  );
}
