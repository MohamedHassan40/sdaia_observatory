"use server";


export async function fetchNews(page: number) {
  const apiUrl = `https://sdaia-observatory.vercel.app/api/getNews?page=${page}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
