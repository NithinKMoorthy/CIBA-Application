import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("ROUTE HIT: ");
  console.log("IN EMAIL ADD: ");
  try {
    const { m2mToken } = await req.json(); // Extract userId and M2M token

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    // Create an MFA Enrollment Ticket (without phone_number in the payload)
    const emailAddedResponse = await axios.put(
        `https://${domain}/api/v2/guardian/factors/email`,
        {
            enabled: true 
        }, // empty body for PUT
        {
          headers: {
            Authorization: `Bearer ${m2mToken}`, // M2M token for authentication
            'Content-Type': 'application/json',
          }
        }
      );
      



    console.log("Email Ticket Response: ", emailAddedResponse.data);

    // Return the enrollment ticket URL to the client
    return NextResponse.json({ ticket_url: emailAddedResponse.data });
  } catch (error) {
    console.error("Error creating email add", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to create email add', error: error.message },
      { status: 500 }
    );
  }
}
