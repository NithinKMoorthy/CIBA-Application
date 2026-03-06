import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("UPDATE ACTION: ");
  try {
    const { m2mToken, actionId, code, name } = await req.json();
    console.log("Updating action:", actionId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const updateResponse = await axios.patch(
      `https://${domain}/api/v2/actions/actions/${actionId}`,
      {
        code,
        name
      },
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Action updated successfully:", updateResponse.data);

    return NextResponse.json(updateResponse.data);
  } catch (error) {
    console.error("Error updating action:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error updating action', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
