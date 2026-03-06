import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("REMOVE USER FROM ORGANIZATION: ");
  try {
    const { m2mToken, organizationId, userId } = await req.json();
    console.log("Removing user", userId, "from organization", organizationId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const removeResponse = await axios.delete(
      `https://${domain}/api/v2/organizations/${organizationId}/members`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          members: [userId]
        }
      }
    );

    console.log("Remove User Response: ", removeResponse.data);

    return NextResponse.json({ success: true, message: 'User removed from organization successfully' });
  } catch (error) {
    console.error("Error removing user from organization:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error removing user from organization', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
