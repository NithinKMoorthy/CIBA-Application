import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import jwksClient from 'jwks-rsa';

export const dynamic = 'force-dynamic'; // Ensure this route is dynamic

const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

// Correct JWKS URI with full Auth0 domain
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

// API route to verify MFA
export async function GET(request) { // Add 'request' parameter here
  try {
    // Retrieve the session to get the ID token
    const session = await getSession(request); // Pass 'request' to getSession
    const idToken = session?.idToken;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token not found' }, { status: 401 });
    }

    // Verify the token and check MFA (wait for async verification)
    const mfaUsed = await handleTokenVerification(idToken);

    return NextResponse.json({ mfaUsed });
  } catch (error) {
    console.error('Error verifying MFA:', error);
    return NextResponse.json({ error: 'Failed to verify MFA' }, { status: 500 });
  }
}
