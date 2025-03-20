import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
// import { access } from 'fs';

export default withApiAuthRequired(async function products(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    // const client = new BillingApiClient(accessToken);
    console.log("ACCESS TOKEN: ", accessToken);
    // return client.getBillingInfo();
  } catch(error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
});