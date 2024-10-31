export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/news/articles/?page=${page}`,
    {
      next : {revalidate: 30}
    }
  );
  const data = await res.json();

  return Response.json(data);
}
