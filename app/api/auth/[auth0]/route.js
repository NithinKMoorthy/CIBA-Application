import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`;

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      // scope: 'openid profile email mfa offline_access',
      scope: 'openid profile email mfa offline_access read:me:factors read:me:authentication_methods create:me:authentication_methods',
      audience: `${issuerBaseUrl}/me/`
      // audience: 'https://ropg-api',
    },
    returnTo: '/dashboard',
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
      // scope: 'openid profile email offline_access',
      audience: `${issuerBaseUrl}/me/`
      // audience: 'https://ropg-api'
    },
    returnTo: '/dashboard',
  }),
  callback: handleCallback({
    afterCallback: async (req, session) => {
      // Store refresh token in session
      return session;
    },
  }),
});


// initial login read:me:factors (doesn't need mfa)
// but there are other reasons mfa may happen

// did you mfa already or not? 