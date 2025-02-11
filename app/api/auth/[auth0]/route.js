import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      scope: 'openid profile email mfa',
      audience: 'https://ropg-api'
    },
    returnTo: '/dashboard', 
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
    },
    returnTo: '/dashboard', 
  }),
});
