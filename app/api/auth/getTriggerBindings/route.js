import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("GET TRIGGER BINDINGS: ");
  try {
    const { m2mToken, triggerId } = await req.json();
    console.log("Getting bindings for trigger:", triggerId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const bindingsResponse = await axios.get(
      `https://${domain}/api/v2/actions/triggers/${triggerId}/bindings`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Bindings Response:", bindingsResponse.data);

    return NextResponse.json(bindingsResponse.data);
  } catch (error) {
    console.error("Error retrieving trigger bindings:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving trigger bindings', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
