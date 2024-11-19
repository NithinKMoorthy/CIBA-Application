import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Helper function to generate a secure random state
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

export async function GET(req) {
  const authUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/authorize`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback');
  authUrl.searchParams.set('scope', 'openid profile email');

  // Generate and set state
  const state = generateState();
  console.log("STATE:", state);
  authUrl.searchParams.set('state', state);

  // Store state in a secure cookie or session (example with cookie)
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('auth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return response;
}
