import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("GET Triggers: ");
  try {
    const { m2mToken } = await req.json(); // Extract M2M token
    console.log("M2MToken: ", m2mToken);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const actionsResponse = await axios.get(
      `https://${domain}/api/v2/actions/triggers`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Actions Response : ", actionsResponse.data);
    let triggers = actionsResponse.data.triggers; 
    let triggerIdArray = triggers.map(trigger => trigger.id);
    console.log("TriggerIdArray", triggerIdArray);
    const triggerSet = new Set(triggerIdArray);
    console.log("Trigger Set: ", triggerSet);

    return NextResponse.json(actionsResponse.data); // ✅ Use .data only
  } catch (error) {
    console.error("Error retrieving actions:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving actions', error: error.message },
      { status: 500 }
    );
  }
}
