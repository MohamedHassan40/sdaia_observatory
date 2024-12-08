"use server";

export async function fetchTweets(page: number) {
  const apiUrl = `https://sdaia-observatory.vercel.app/api/getTweets?page=${page}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // Sort tweets by date (newest to oldest)
    const sortedResults = data?.results?.sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return { ...data, results: sortedResults };
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return null;
  }
}
