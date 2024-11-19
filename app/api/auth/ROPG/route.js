import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const { username, password } = await req.json();

  const clientId = 'yrWxK1NYTvtsSA20UswtvqVUojjBwEMX';
  const clientSecret = '-en0wiP4J6Ir_NsfcuZ6JDxUrxNQTvQ6q-aUuRUt2MpBIzywauU12L0E6qXy6haT';

  const options = {
    method: 'POST',
    url: 'https://dev-ow0gmshf.us.auth0.com/oauth/token',
    headers: { 'Content-Type': 'application/json' },
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      audience: 'https://ropg-api', 
      grant_type: 'password',
      username,
      password,
      scope: 'openid profile email read:authenticators',
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