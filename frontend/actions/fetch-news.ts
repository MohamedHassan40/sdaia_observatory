"use server";


export async function fetchNews(page: number) {
  const apiUrl = `https://sdaia-observatory.vercel.app/api/getNews?page=${page}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // Sort news by date (newest to oldest)
    const sortedResults = data?.results?.sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return { ...data, results: sortedResults };
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}
