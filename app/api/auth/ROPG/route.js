import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const { username, password } = await req.json();

  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
  const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || `https://${domain}`;

  const options = {
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    headers: { 'Content-Type': 'application/json' },
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      audience: `${issuerBaseUrl}/me/`,
      // audience: 'https://ropg-api',
      grant_type: 'password',
      username,
      password,
      scope: 'openid profile email offline_access'
      // scope: 'openid profile email offline_access read:me:factors read:me:authentication_methods create:me:authentication_methods',
    },
  };

  try {
    const response = await axios(options);
    console.log("RESPONSE: ", response);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("IN ERROR");
    console.log("Error: ", error.response.data);
    const errorMessage = error.response?.data?.error_description || 'Login failed';
    // let errMessage = error.response.data;
    console.error('Error fetching token:', errorMessage);
    return NextResponse.json(
         error.response?.data || 'An unknown error occurred',
        { status: error.response?.status || 500 }
    );
  }
} 