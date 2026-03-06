import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { mfa_token, otp } = await req.json();
    console.log("HELLO");
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    // Make a request to Auth0 to verify the OTP
    const response = await axios.post(
      `https://${domain}/oauth/token`,
      {
        grant_type: 'http://auth0.com/oauth/grant-type/mfa-otp',
        client_id: clientId,
        client_secret: clientSecret,
        mfa_token: mfa_token,
        otp: otp,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the success response back to the frontend
    console.log("RESPONSE.DATA: ", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    // Handle and log any error from Auth0
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error_description || 'OTP verification failed';

    console.error('Error verifying OTP:', errorMessage);

    // Return a structured error response
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
