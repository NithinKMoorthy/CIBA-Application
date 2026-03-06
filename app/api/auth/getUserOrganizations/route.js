import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("GET USER ORGANIZATIONS: ");
  try {
    const { m2mToken, userId } = await req.json();
    console.log("Getting organizations for user:", userId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const orgsResponse = await axios.get(
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}/organizations`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("User Organizations Response: ", orgsResponse.data);

    return NextResponse.json(orgsResponse.data);
  } catch (error) {
    console.error("Error retrieving user organizations:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving user organizations', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
