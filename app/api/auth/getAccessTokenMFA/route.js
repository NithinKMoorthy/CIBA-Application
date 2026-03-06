import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function GET(request) {
  try {
    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    // getAccessToken signature differs in Next.js 13 vs Next 12.
    // It doesn't automatically provide `res`, so we only pass the request.
    // Also, consider how you'll store and retrieve cookies/session in Next 13.
    const { accessToken } = await getAccessToken(request, {
      audience: `https://${domain}/api/v2/`,
      scope: 'openid mfa read:authenticators',
    });

    if (!accessToken) {
      return NextResponse.json({ message: 'No access token found' }, { status: 401 });
    }

    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
