import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  console.log("GET USERS: ");
  try {
    const { m2mToken, page = 0, perPage = 50, search = '' } = await req.json();
    console.log("M2MToken: ", m2mToken);

    const domain = process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');

    const params = {
      page,
      per_page: perPage,
      include_totals: true,
      sort: 'created_at:-1'
    };

    if (search) {
      params.q = search;
      params.search_engine = 'v3';
    }

    const usersResponse = await axios.get(
      `https://${domain}/api/v2/users`,
      {
        headers: {
          Authorization: `Bearer ${m2mToken}`,
          'Content-Type': 'application/json',
        },
        params
      }
    );

    console.log("Users Response: ", usersResponse.data);

    return NextResponse.json(usersResponse.data);
  } catch (error) {
    console.error("Error retrieving users:", error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Error retrieving users', error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
