export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = 25;

  //   const apiURL = `https://api.openalex.org/authors?filter=last_known_institutions.country_code:sa,x_concepts.id:
  //   C31972630|C133731056|C124101348|C107457646|C23123220|C119857082|C126255220|C204321447|C79403827|C44154836|C28490314|C80444323
  //   &page=${page}&per_page=${pageSize}`;

  const apiURL = `https://api.openalex.org/authors?filter=affiliations.institution.country_code:sa,x_concepts.id:C154945302|C11413529|C119857082|C204321447&page=${page}&per_page=${pageSize}`;

  const res = await fetch(apiURL, {
    next : {revalidate: 1800}
  });
  const data = await res.json();

  return Response.json(data);
}
