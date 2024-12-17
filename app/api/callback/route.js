// app/api/auth/callback/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';
// import qs from 'qs';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state');

    if (!code) {
        return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
    }

    // Retrieve the stored `state` and `nonce` from cookies
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const storedState = cookies.auth_state;
    const storedNonce = cookies.auth_nonce;

    // Validate the `state` parameter
    if (!storedState || storedState !== returnedState) {
        return NextResponse.json({ error: 'State mismatch' }, { status: 400 });
    }

    // Exchange the authorization code for tokens
    try {
        const tokenResponse = await axios.post(
            `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
            qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:3000/api/auth/callback',
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, id_token } = tokenResponse.data;

        // Decode the ID token to retrieve the `nonce`
        const decodedToken = jwt.decode(id_token);
        const idTokenNonce = decodedToken?.nonce;

        // Validate the `nonce` parameter
        if (!storedNonce || storedNonce !== idTokenNonce) {
            return NextResponse.json({ error: 'Nonce mismatch' }, { status: 400 });
        }

        // Set tokens in cookies for secure storage
        const response = NextResponse.json({ message: 'Authentication successful' });
        response.cookies.set('access_token', access_token, { httpOnly: true, secure: true, path: '/' });
        response.cookies.set('id_token', id_token, { httpOnly: true, secure: true, path: '/' });

        return response;
    } catch (error) {
        console.error('Token Exchange Error:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 });
    }
}
