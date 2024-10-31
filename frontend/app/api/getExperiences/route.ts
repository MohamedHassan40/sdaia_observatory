export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1"; // Default to page 1 if not provided
  
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/talent/experience/?page=${page}`,
      {
        next: { revalidate: 1800 },
      }
    );
    const data = await res.json();
    console.log('Fetched data from backend:', data);
  
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }
  