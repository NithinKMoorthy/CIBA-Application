// /app/api/auth/createSession/route.js
import { sessionCache } from '@auth0/nextjs-auth0';

export async function POST(req) {
  console.log("Creating Session Route Hit");

  const body = await req.json();
  const { accessToken, idToken, user } = body;

  const session = {
    user,
    accessToken,
    idToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600 * 1000, // 1 hour
  };

  const res = new Response(null, { status: 200 });

  await sessionCache.save(req, res, session);
  return res;
}
