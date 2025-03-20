// app/api/manage-authenticators/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { access } from 'fs';

export async function POST(req) {
  const { userId } = await req.json(); // Expecting userId in request body
  const domain = 'dev-ow0gmshf.us.auth0.com';
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  console.log("USER ID :", userId);
  try {
    // Get the token
    const tokenResponse = await axios.post(`https://${domain}/oauth/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://dev-ow0gmshf.us.auth0.com/api/v2/`,
      grant_type: 'client_credentials',
      scope: 'read:authentication_methods update:users'
    });
    const accessToken = tokenResponse.data.access_token;
    console.log("ACCESS TOKEN: ", accessToken);
    // Fetch authenticators
     

    const response = await axios.get(
      `https://${domain}/api/v2/users/${userId}/authentication-methods`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching authenticators:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch authenticators' },
      { status: 500 }
    );
  }
}
