import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { userId, m2mToken } = await req.json(); // Extract userId and M2M token
    console.log("USERID: ", userId, " + M2MToken: ", m2mToken);
    
    const domain = 'dev-ow0gmshf.us.auth0.com';

    // Create an MFA Enrollment Ticket (without phone_number in the payload)
    const enrollmentTicketResponse = await axios.post(
      `https://${domain}/api/v2/guardian/enrollments/ticket`,
      {
        user_id: userId,  // Auth0 user ID
        send_mail: false, // Optionally send an email with enrollment instructions
        allow_multiple_enrollments: true, 
        // factor: 'otp'
      },
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`, // M2M token for authentication
          'Content-Type': 'application/json',
        },
      }
    );

  

    console.log("Enrollment Ticket Response: ", enrollmentTicketResponse.data);

    // Return the enrollment ticket URL to the client
    return NextResponse.json({ ticket_url: enrollmentTicketResponse.data.ticket_url });
  } catch (error) {
    console.error("Error creating enrollment ticket:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to create MFA Enrollment Ticket', error: error.message },
      { status: 500 }
    );
  }
}
