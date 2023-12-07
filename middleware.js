import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// protect /dashboard routes
export const config = {
  matcher: [
    "/dashboard/user/:path*",
    "/dashboard/admin/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};

// implement role based authorization
