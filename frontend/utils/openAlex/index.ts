import { data } from "@/constants/staticData";

export function convertTopicsToBarChartData(topics: any) {
  return {
    labels: topics.group_by
      .slice(0, 10)
      .map((topic: any) => topic.key_display_name),
    datasets: [
      {
        label: "Number of Publications",
        data: topics.group_by.map((topic: any) => topic.count),
        backgroundColor: "rgba(28, 53, 94, 0.2)",
        borderColor: "rgba(28, 53, 94, 1)",
        borderWidth: 1,
      },
    ],
  };
}
export function convertArticlesToLineChartData(Articles: any) {

  // sort articly by key descending
  Articles.group_by.sort((a: any, b: any) => {
    return b.key - a.key;
  });





  return {
    labels: Articles.group_by.map((Article: any) => Article.key_display_name),
    datasets: [
      {
        label: "Publication Growth Year Over Year",
        data: Articles.group_by.map((article: any) => article.count),        
        backgroundColor: "rgba(28, 53, 94, 0.2)",
        borderColor: "rgba(28, 53, 94, 1)",
        borderWidth: 1,
      },
    ],
  };
}
