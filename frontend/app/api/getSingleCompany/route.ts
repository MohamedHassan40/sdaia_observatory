export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/talent/companies/${id}`,
    {
      next : {revalidate: 1800}
    }
  );
  
  const data = await res.json();
  console.log(data);
  return Response.json(data);
}
