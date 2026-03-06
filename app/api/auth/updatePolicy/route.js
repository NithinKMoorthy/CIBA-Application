import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(req) {
  try {
    let { m2mToken, policy, enabled } = await req.json();
    console.log("IN FUNCTION UPDATE POLICY");
    // console.log("m2Mtoken: ", m2mToken);
    console.log("policy: ", policy);
    console.log("enabled: ", enabled);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    let policies = [];
    if(policy == 'all-applications') {
      policies.push('all-applications'); 
    }  else if (policy == 'confidence-score') {
      policies.push('confidence-score');
    }
    // // Step 1: Fetch existing policies
    // const current = await axios.get(
    //   `https://${domain}/api/v2/guardian/policies`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${m2mToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );
    // console.log("CURRENT: ", current.data);

    // // Step 2: Modify policies based on toggle
    // let updatedPolicies = new Set(current.data);
    // if (enabled) {
    //   updatedPolicies.add(policy);
    // } else {
    //   updatedPolicies.delete(policy);
    // }
    // console.log("Updated Policies", updatedPolicies);

    // Step 3: Submit updated policy list
    const update = await axios.put(
      `https://${domain}/api/v2/guardian/policies`,
      policies,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Update: ", update.data);

    return NextResponse.json({ success: true, data: update.data });
  } catch (error) {
    console.error("Error updating MFA policy:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to update MFA policy', error: error.message },
      { status: 500 }
    );
  }
}
