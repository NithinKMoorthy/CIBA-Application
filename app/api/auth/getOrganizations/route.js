import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("GET ORGANIZATIONS: ");
  try {
    const { m2mToken } = await req.json();
    console.log("M2MToken: ", m2mToken);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const orgsResponse = await axios.get(
      `https://${domain}/api/v2/organizations`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Organizations Response: ", orgsResponse.data);

    return NextResponse.json(orgsResponse.data);
  } catch (error) {
    console.error("Error retrieving organizations:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving organizations', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
