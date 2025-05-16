import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("ROUTE HIT: ");
  try {
    const { userId, m2mToken } = await req.json(); // Extract userId and M2M token
    console.log("USERID: ", userId, " + M2MToken: ", m2mToken);
    
    const domain = 'dev-ow0gmshf.us.auth0.com';

    // Create an MFA Enrollment Ticket (without phone_number in the payload)
    const emailAddedResponse = await axios.post(
      `https://${domain}/api/v2/users/${userId}/authentication-methods`,
      {
        type: 'phone', // Optionally send an email with enrollment instructions
        phone_number: "+14255223386"

      },
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`, // M2M token for authentication
          'Content-Type': 'application/json',
        },
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
