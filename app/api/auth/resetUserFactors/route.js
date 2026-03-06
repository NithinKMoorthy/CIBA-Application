import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("RESET USER MFA FACTORS: ");
  try {
    const { m2mToken, userId } = await req.json();
    console.log("Resetting factors for user:", userId);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    // Delete all MFA enrollments for the user
    const resetResponse = await axios.delete(
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}/multifactor/actions/invalidate`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Factors Reset Response: ", resetResponse.data);

    return NextResponse.json({ success: true, message: 'MFA factors reset successfully' });
  } catch (error) {
    console.error("Error resetting user factors:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error resetting user factors', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
