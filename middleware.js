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
export default withAuth(
  async function middleware(req) {
    // get url from request body
    const url = req.nextUrl.pathname;

    // get user role from token
    const userRole = req?.nextauth?.token?.user?.role;

    if (url?.includes("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false;
        }
      },
    },
  }
);
