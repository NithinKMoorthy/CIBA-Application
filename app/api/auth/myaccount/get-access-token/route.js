import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// All My Account API scopes
const MY_ACCOUNT_SCOPES = [
  'create:me:authentication_methods',
  'read:me:authentication_methods',
  'update:me:authentication_methods',
  'delete:me:authentication_methods',
  'read:me:factors'
].join(' ');

export async function POST(request) {
  console.log("GETTING ACCESS TOKEN /myaccount/get-access-token")
  try {
    const body = await request.json();
    const { refresh_token } = body;

    // Validate required fields
    if (!refresh_token) {
      return NextResponse.json(
        { error: 'refresh_token is required' },
        { status: 400 }
      );
    }

    const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    // Prepare the token refresh request for My Account API
    const tokenRequestBody = {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refresh_token,
      audience: `${issuerBaseUrl}/me/`,
      scope: MY_ACCOUNT_SCOPES
    };

    console.log('Getting access token for My Account API...');
    console.log('Audience:', `${issuerBaseUrl}/me/`);
    console.log('Scopes:', MY_ACCOUNT_SCOPES);

    // Call Auth0 token endpoint
    const response = await fetch(`${issuerBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenRequestBody),
    });

    const data = await response.json();

    console.log('Full Auth0 Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Token refresh failed:', data);
      return NextResponse.json(
        {
          error: data.error || 'Token refresh failed',
          error_description: data.error_description || 'Failed to get access token'
        },
        { status: response.status }
      );
    }

    console.log('Access token obtained successfully!');
    console.log('Access Token:', data.access_token);
    console.log('Granted Scopes from response:', data.scope);

    // Decode the JWT to see what scopes are actually in the token
    let tokenScopes = null;
    if (data.access_token) {
      try {
        const base64Url = data.access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          Buffer.from(base64, 'base64')
            .toString('utf-8')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        tokenScopes = decoded.scope || decoded.scp || decoded.permissions;
        console.log('Decoded Token Payload:', JSON.stringify(decoded, null, 2));
        console.log('Scopes from decoded token:', tokenScopes);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    // Return the access token and details
    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      scope: data.scope || tokenScopes, // Use scope from response, fallback to decoded token scopes
      refresh_token: data.refresh_token, // New refresh token if rotation is enabled
      id_token: data.id_token // May be present
    });

  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
