import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`;
const apiBaseUrl = `${issuerBaseUrl}/me`;

// Get available factors
export async function GET(request) {
  console.log("GETTING FACTORS!!!!");
  try {
    const authHeader = request.headers.get('authorization');
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }
    console.log(`Calling ${apiBaseUrl}/v1/factors`)
    const response = await axios.get(
      `${apiBaseUrl}/v1/factors`,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching factors:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
