import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

  const options = {
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials',
    },
  };

  try {
    const response = await axios(options);
    const accessToken = response.data.access_token;

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error fetching MFA token:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Unable to fetch token', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
