import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    // Parse the request body
    const { mfa_token, otp, oobCode } = await req.json();
    console.log("MFA TOKEN: ", mfa_token);
    console.log("OTP: ", otp);
    console.log("OOB CODE: ", oobCode);

    // Client details
    const client_id = 'yrWxK1NYTvtsSA20UswtvqVUojjBwEMX';
    const client_secret = '-en0wiP4J6Ir_NsfcuZ6JDxUrxNQTvQ6q-aUuRUt2MpBIzywauU12L0E6qXy6haT';

    // Prepare the request body
    const response = await axios.post(
      'https://dev-ow0gmshf.us.auth0.com/oauth/token',
      new URLSearchParams({
        grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
        client_id,
        client_secret,
        mfa_token,
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
    console.error("Error making Auth0 request:", error);

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
