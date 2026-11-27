import { NextResponse } from 'next/server';
import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

const protectedHandler = withApiAuthRequired(async function handler(req) {
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

// Next.js 15 passes route params as a Promise; resolve them for the Auth0 v3 wrapper.
export async function GET(req, ctx) {
  return protectedHandler(req, { params: await ctx.params });
}
