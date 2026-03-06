import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  // Check if user has ROPG authentication cookie
  const ropgAuth = req.cookies.get('ropg_authenticated');

  if (ropgAuth?.value === 'true') {
    // User is authenticated via ROPG, allow access
    return NextResponse.next();
  }

  // Fall back to Auth0 session check
  return withMiddlewareAuthRequired()(req);
}

export const config = {
  matcher: ["/protected", "/dashboard/:path*"],
};