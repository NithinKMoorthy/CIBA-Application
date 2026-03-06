import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("ADD USER TO ORGANIZATION: ");
  try {
    const { m2mToken, organizationId, userId } = await req.json();
    console.log("Adding user", userId, "to organization", organizationId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const addResponse = await axios.post(
      `https://${domain}/api/v2/organizations/${organizationId}/members`,
      {
        members: [userId]
      },
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Add User Response: ", addResponse.data);

    return NextResponse.json({ success: true, message: 'User added to organization successfully' });
  } catch (error) {
    console.error("Error adding user to organization:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error adding user to organization', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
