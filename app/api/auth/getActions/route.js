import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("GET ACTIONS: ");
  try {
    const { m2mToken } = await req.json(); // Extract M2M token
    console.log("M2MToken: ", m2mToken);
    
    const domain = 'dev-ow0gmshf.us.auth0.com';

    const actionsResponse = await axios.get(
      `https://${domain}/api/v2/actions/actions?deployed=true`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Actions Response : ", actionsResponse.data);

    return NextResponse.json(actionsResponse.data); // ✅ Use .data only
  } catch (error) {
    console.error("Error retrieving actions:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving actions', error: error.message },
      { status: 500 }
    );
  }
}
