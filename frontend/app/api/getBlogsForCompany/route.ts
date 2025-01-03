export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/talent/blogs/by-company/${id}/`,
    {
      next : {revalidate: 30}
    }
  );
  const data = await res.json();
  return Response.json(data);
}
