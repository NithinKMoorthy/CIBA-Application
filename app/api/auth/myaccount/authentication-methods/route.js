import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`;
const apiBaseUrl = `${issuerBaseUrl}/me`;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

// All My Account API scopes
const MY_ACCOUNT_SCOPES = [
  'create:me:authentication_methods',
  'read:me:authentication_methods',
  'update:me:authentication_methods',
  'delete:me:authentication_methods',
  'read:me:factors'
].join(' ');

// Helper function to get access token from refresh token
async function getAccessTokenFromRefreshToken(refreshToken) {
  const tokenRequestBody = {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    audience: `${issuerBaseUrl}/me/`,
    scope: MY_ACCOUNT_SCOPES
  };

  const response = await fetch(`${issuerBaseUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokenRequestBody),
  });

  const data = await response.json();
  console.log("DATA: ", data )
  if (!response.ok) {
    console.error('Token refresh failed:', data);
    throw new Error(data.error_description || 'Token refresh failed');
  }

  return data.access_token;
}

// Get authentication methods
export async function GET(request) {
  console.log("IN AUTH-METHODS");
  try {
    let authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const refreshToken = url.searchParams.get('refresh_token');

    // If no auth header but refresh token is provided, get access token
    if (!authHeader && refreshToken) {
      const accessToken = await getAccessTokenFromRefreshToken(refreshToken);
      authHeader = `Bearer ${accessToken}`;
    }

    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header or refresh_token parameter required'
      }, { status: 401 });
    }
    console.log(`Calling ${apiBaseUrl}/v1/authentication-methods`)
    const response = await axios.get(
      `${apiBaseUrl}/v1/authentication-methods`,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching authentication methods:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// Delete authentication method
export async function DELETE(request) {
  try {
    let authHeader = request.headers.get('authorization');
    const { methodId, refresh_token } = await request.json();

    // If no auth header but refresh token is provided, get access token
    if (!authHeader && refresh_token) {
      const accessToken = await getAccessTokenFromRefreshToken(refresh_token);
      authHeader = `Bearer ${accessToken}`;
    }

    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header or refresh_token in body required'
      }, { status: 401 });
    }

    const response = await axios.delete(
      `${apiBaseUrl}/authentication-methods/${methodId}`,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error deleting authentication method:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

// Create/Enroll new authentication method
export async function POST(request) {
  try {
    let authHeader = request.headers.get('authorization');
    const body = await request.json();
    const { refresh_token, ...methodData } = body;

    // If no auth header but refresh token is provided, get access token
    if (!authHeader && refresh_token) {
      const accessToken = await getAccessTokenFromRefreshToken(refresh_token);
      authHeader = `Bearer ${accessToken}`;
    }

    if (!authHeader) {
      return NextResponse.json({
        error: 'Authorization header or refresh_token in body required'
      }, { status: 401 });
    }

    const response = await axios.post(
      `${apiBaseUrl}/authentication-methods`,
      methodData,
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating authentication method:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}
