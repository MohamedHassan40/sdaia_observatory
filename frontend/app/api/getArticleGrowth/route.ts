// https://api.openalex.org/works?group_by=publication_year&per_page=200&filter=primary_topic.subfield.id:1702,authorships.countries:countries/sa

export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const page = searchParams.get("page");

  const pageSize = 100;

  const apiUrl = `https://api.openalex.org/works?group_by=publication_year&per_page=${pageSize}&filter=primary_topic.subfield.id:1702,authorships.countries:countries/sa`;

  const res = await fetch(apiUrl, {
    next : {revalidate: 30}
  });
  const data = await res.json();

  return Response.json(data);
}
