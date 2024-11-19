import { getAccessToken } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      audience: 'https://dev-ow0gmshf.us.auth0.com/api/v2/',
      scope: 'openid mfa read:authenticators',
    });

    if (!accessToken) {
      return res.status(401).json({ message: 'No access token found' });
    }

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
