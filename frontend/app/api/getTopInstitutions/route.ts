export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const page = searchParams.get("page");

  const pageSize = 25;

  const apiUrl = `https://api.openalex.org/institutions?filter=country_code:sa,type:education&sort=works_count:desc&page=1&per_page=${pageSize}`;

  const res = await fetch(apiUrl, {
    next : {revalidate: 1800}
  });
  const data = await res.json();

  return Response.json(data);
}
