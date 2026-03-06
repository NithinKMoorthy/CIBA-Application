import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { refreshToken, audience, scope } = body;

    // Validate required fields
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const domain = process.env.AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    // Prepare the token refresh request
    const tokenRequestBody = {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    };

    // Add optional parameters if provided
    if (audience) {
      tokenRequestBody.audience = audience;
    }

    if (scope) {
      tokenRequestBody.scope = scope;
    }

    console.log('Refreshing token with Auth0...');

    // Call Auth0 token endpoint
    const response = await fetch(`${domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenRequestBody),
    });

    const data = await response.json();
    console.log("DATA: ", data);

    if (!response.ok) {
      console.error('Token refresh failed:', data);
      return NextResponse.json(
        {
          error: data.error || 'Token refresh failed',
          error_description: data.error_description || 'Failed to refresh access token'
        },
        { status: response.status }
      );
    }

    console.log('Token refreshed successfully');

    // Return the new tokens
    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token, // May or may not be present
      id_token: data.id_token, // May or may not be present
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope,
    });

  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
