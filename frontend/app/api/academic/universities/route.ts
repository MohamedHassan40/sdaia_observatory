// export async function GET() {
//   const res = await fetch(`${process.env.BACKEND_URL}api/academic/universities/`);
//   const data = await res.json();
//   let universities = Array.isArray(data) ? data : data.results || [];
//   return Response.json(universities);
// } 