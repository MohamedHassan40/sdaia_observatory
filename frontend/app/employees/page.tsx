import React from "react";
import PageClient from "./page-client";

export default async function Page() {
  // const data = await fetch(`${process.env.BASE_FETCH_URL}/api/getCompanies`);
  // let companies = await data.json();

  return (
    <>
      <PageClient />
    </>
  );
}
