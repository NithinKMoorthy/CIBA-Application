import { NextResponse } from 'next/server';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async function handler(req) {
  try {
    const res = new Response(); // Create a response object for Auth0 functions
    const { accessToken } = await getAccessToken(req, res);

    console.log("ACCESS TOKEN:", accessToken);

    return NextResponse.json({ accessToken });
  } catch(error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
