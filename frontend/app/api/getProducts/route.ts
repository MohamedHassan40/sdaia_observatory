export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/talent/products/?page=${page}`,
    {
      next: { revalidate: 1800 },
    }
  );
  const data = await res.json();
  let products = Array.isArray(data) ? data : data.results || [];
  return Response.json(products);
}
