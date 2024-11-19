import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const clientId = 'yrWxK1NYTvtsSA20UswtvqVUojjBwEMX';
  const clientSecret = '-en0wiP4J6Ir_NsfcuZ6JDxUrxNQTvQ6q-aUuRUt2MpBIzywauU12L0E6qXy6haT';
  const domain = 'https://dev-ow0gmshf.us.auth0.com/api/v2/';

  const options = {
    method: 'POST',
    url: `https://dev-ow0gmshf.us.auth0.com/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      audience: 'https://dev-ow0gmshf.us.auth0.com/api/v2/',
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
