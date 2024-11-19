import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { mfa_token, otp } = await req.json();
    console.log("HELLO");
    const clientId = 'yrWxK1NYTvtsSA20UswtvqVUojjBwEMX';
    const clientSecret = '-en0wiP4J6Ir_NsfcuZ6JDxUrxNQTvQ6q-aUuRUt2MpBIzywauU12L0E6qXy6haT';

    // Make a request to Auth0 to verify the OTP
    const response = await axios.post(
      'https://dev-ow0gmshf.us.auth0.com/oauth/token',
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
