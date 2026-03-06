import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("DEPLOY ACTION: ");
  try {
    const { m2mToken, actionId, triggerId } = await req.json();
    console.log("Deploying action:", actionId, "to trigger:", triggerId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    // First, deploy the action
    const deployResponse = await axios.post(
      `https://${domain}/api/v2/actions/actions/${actionId}/deploy`,
      {},
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Action deployed:", deployResponse.data);

    // Then, bind it to the trigger
    const bindResponse = await axios.patch(
      `https://${domain}/api/v2/actions/triggers/${triggerId}/bindings`,
      {
        bindings: [
          {
            ref: {
              type: 'action_id',
              value: actionId
            },
            display_name: deployResponse.data.name
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Action bound to trigger:", bindResponse.data);

    return NextResponse.json({
      deployed: deployResponse.data,
      bound: bindResponse.data
    });
  } catch (error) {
    console.error("Error deploying action:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error deploying action', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
