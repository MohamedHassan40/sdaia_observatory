export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = searchParams.get("page");
    const searchQuery = searchParams.get("search");
    const pageSize = 100;

    // const apiUrl = `https://api.openalex.org/works?search=${encodeURIComponent(
    //     searchQuery || ""
    //   )}&filter=authorships.institutions.country_code:sa&sort=publication_year:desc&page=${page}&per_page=${pageSize}`;
    

    const apiUrl = `https://api.openalex.org/works?filter=authorships.institutions.country_code:sa,primary_topic.subfield.id:1702&sort=publication_year:desc&page=${page}&per_page=${pageSize}`;
    
    const res = await fetch(
        apiUrl,
      {
        next : {revalidate: 1800}
      }
    );
    const data = await res.json();
    return Response.json(data);
  }
  