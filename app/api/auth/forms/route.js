// /app/api/auth/forms/route.js
export const dynamic = 'force-dynamic';

import { handleLogin } from '@auth0/nextjs-auth0';

export async function GET(request) {
  return handleLogin({
    authorizationParams: {
      action: 'configure_factors',
      scope: 'openid profile email mfa',
      audience: 'https://ropg-api',
    },
    returnTo: '/dashboard',
  })(request);
}
