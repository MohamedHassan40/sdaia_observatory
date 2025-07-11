"use server";

export async function fetchNews(page: number) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news?page=${page}`;
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Check if the response contains an error
    if (data.error) {
      console.error("API returned error:", data.error);
      return null;
    }
    
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
