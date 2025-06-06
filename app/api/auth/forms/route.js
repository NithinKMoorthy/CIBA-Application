// /app/api/auth/forms/route.js
import { handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleLogin({
  authorizationParams: {
    action: 'configure_factors',
    scope: 'openid profile email mfa',
    audience: 'https://ropg-api'
  },
  returnTo: '/dashboard'
});
