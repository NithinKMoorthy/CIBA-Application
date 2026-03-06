import { NextResponse } from 'next/server';
import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic'; // Ensure dynamic route

const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

const client = jwksClient({
  jwksUri: `https://${domain}/.well-known/jwks.json`,
});

// Function to retrieve the public key
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// Function to verify the token using RS256 and JWKS (with async handling)
const handleTokenVerification = (idToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(idToken, getKey, { algorithms: ['RS256'] }, (err, decodedToken) => {
      if (err) {
        console.error('Invalid token or verification failed:', err);
        return reject(false); // MFA not verified due to invalid token
      }

      // Check if MFA was used
      if (Array.isArray(decodedToken?.amr) && decodedToken?.amr.includes('mfa')) {
        console.log('MFA was used');
        resolve(true);
      } else {
        console.log('MFA was NOT used');
        resolve(false);
      }
    });
  });
};

// Create an API route using App Router's new structure
export async function GET(request) {
  try {
    // Retrieve access token from session
    const { accessToken } = await getAccessToken(request); // Pass request to getAccessToken
    const session = await getSession(request); // Pass request object if necessary

    console.log('Full session object:', JSON.stringify(session, null, 2));

    const idToken = session?.idToken;
    const refreshToken = session?.refreshToken; // Get refresh token from session

    // Perform token verification if needed
    const isMfaVerified = await handleTokenVerification(idToken);

    console.log('Refresh token found:', refreshToken ? 'Yes' : 'No');

    // Respond with the access token, refresh token, and verification status
    return NextResponse.json({ accessToken, refreshToken, idToken, isMfaVerified });
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
