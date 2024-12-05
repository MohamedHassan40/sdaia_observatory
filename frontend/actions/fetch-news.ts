"use server";


export async function fetchNews(page: number) {
  const apiUrl = `http://35.232.23.77:8000//api/getNews?page=${page}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
