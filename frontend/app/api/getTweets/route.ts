export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/talent/tweets/?page=${page}`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      console.error(`Backend responded with status: ${res.status}`);
      return Response.json(
        { 
          error: "Failed to fetch tweets from backend", 
          status: res.status,
          message: "Backend service unavailable"
        }, 
        { status: 503 }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching tweets from backend:", error);
    return Response.json(
      { 
        error: "Failed to connect to backend", 
        message: "Backend service is not accessible",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 503 }
    );
  }
}
