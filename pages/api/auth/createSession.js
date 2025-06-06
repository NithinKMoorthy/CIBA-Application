// This uses Pages Router API format (Node-style req, res)
import { sessionCache } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  console.log("Creating Session Route Hit");

  const { accessToken, idToken, user } = req.body;

  const session = {
    user,
    accessToken,
    idToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600 * 1000,
  };

  await sessionCache.save(req, res, session);
  res.status(200).end();
}
