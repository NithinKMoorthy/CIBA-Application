import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(req) {
  try {
    const { m2mToken, name, enabled } = await req.json();

    const domain = 'dev-ow0gmshf.us.auth0.com';

    const updateResponse = await axios.put(
      `https://${domain}/api/v2/guardian/factors/${name}`,
      { enabled },
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true, data: updateResponse.data });
  } catch (error) {
    console.error("Error updating MFA factor:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to update MFA factor', error: error.message },
      { status: 500 }
    );
  }
}
