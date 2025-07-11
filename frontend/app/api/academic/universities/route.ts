// pages/api/academic/universities.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}api/academic/universities/`);
    const data = await response.json();
    const universities = Array.isArray(data) ? data : data.results || [];
    res.status(200).json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ error: "Failed to fetch universities" });
  }
}
