import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { m2mToken, triggerId } = await req.json();
    const domain = 'dev-ow0gmshf.us.auth0.com';

    const bindingsResponse = await axios.get(
      `https://${domain}/api/v2/actions/triggers/${triggerId}/bindings`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(bindingsResponse.data);
  } catch (error) {
    console.error('Error retrieving trigger bindings:', error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving trigger bindings', error: error.message },
      { status: 500 }
    );
  }
}
