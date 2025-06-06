import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const {  m2mToken } = await req.json(); // Extract userId and M2M token
    console.log("M2MToken: ", m2mToken);
    
    const domain = 'dev-ow0gmshf.us.auth0.com';

    // Create an MFA Enrollment Ticket (without phone_number in the payload)
    const tenantFactors = await axios.get(
      `https://${domain}/api/v2/guardian/factors`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`, // M2M token for authentication
          'Content-Type': 'application/json',
        },
      }
    );

  

    console.log("Tenant Factors Response: ", tenantFactors.data);

    // Return the enrollment ticket URL to the client
    return NextResponse.json({ ticket_url: tenantFactors.data });
  } catch (error) {
    console.error("Error creating enrollment ticket:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to create MFA Enrollment Ticket', error: error.message },
      { status: 500 }
    );
  }
}
