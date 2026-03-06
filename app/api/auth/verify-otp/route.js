import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    // Parse the request body
    const { mfaToken, otp, oobCode } = await req.json();
    console.log("MFA TOKEN: ", mfaToken);
    console.log("OTP: ", otp);
    console.log("OOB CODE: ", oobCode);

    // Client details
    const client_id = process.env.AUTH0_CLIENT_ID;
    const client_secret = process.env.AUTH0_CLIENT_SECRET;
    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    // Prepare the request body
    const response = await axios.post(
      `https://${domain}/oauth/token`,
      new URLSearchParams({
        grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
        client_id,
        client_secret,
        mfa_token: mfaToken,
        oob_code: oobCode,
        binding_code: otp,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Return successful response
    return NextResponse.json(response.data);
  } catch (error) {
    // console.error("Error making Auth0 request:", error);

    // Check if the error has a response (from Auth0)
    if (error.response) {
      return NextResponse.json(
        {
          error: error.response.data,
          status: error.response.status,
          message: "Auth0 API error",
        },
        { status: error.response.status }
      );
    }

    // Handle other errors (network issues, etc.)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
