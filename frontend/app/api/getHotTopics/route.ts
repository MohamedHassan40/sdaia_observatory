export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const page = searchParams.get("page");

  const pageSize = 50;

  // const apiUrl = `https://api.openalex.org/institutions?filter=country_code:sa,type:education&sort=works_count:desc&page=1&per_page=${pageSize}`;
  const apiUrl = `https://api.openalex.org/works?group_by=primary_topic.id&per_page=${pageSize}&filter=primary_topic.subfield.id:1702,authorships.countries:countries/sa`;

  const res = await fetch(apiUrl, {
    next : {revalidate: 30}
  });
  const data = await res.json();

  return Response.json(data);
}
