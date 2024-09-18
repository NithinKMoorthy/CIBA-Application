import { NextResponse } from 'next/server';
import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import jwksClient from 'jwks-rsa';
const client = jwksClient({
  jwksUri: `https://dev-ow0gmshf.us.auth0.com/.well-known/jwks.json`,
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
export async function GET(request: Request) {
  try {
    // Retrieve access token from session
    const accessToken = await getAccessToken();
    const session = await getSession();
    const idToken = session?.idToken;
    // Respond with the access token
    return NextResponse.json({ accessToken, idToken });
  } catch (error: any) {
    console.error('Error retrieving access token:', error);
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
