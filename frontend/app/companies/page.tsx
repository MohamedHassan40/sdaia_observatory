import React from "react";
import CompaniesList from "./page-client";

export default  function Page() {
  // const data = await fetch(`${process.env.BASE_FETCH_URL}/api/getCompanies`);
  // let companies = await data.json();

  return (
    <>
      <CompaniesList />
    </>
  );
}
