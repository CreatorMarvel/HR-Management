import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If there is a token (meaning the user is authenticated)
  if (token) {
    // Redirect admin users from /employee to /admin

    if (
      token.role === "admin" &&
      req.nextUrl.pathname.startsWith("/employee")
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Redirect regular users from /admin to /employee
    if (token.role === "user" && req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
  } else {
    // If no token is found (user is not authenticated), redirect to sign-in page
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // If no redirection happens, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/employee(.*)", "/admin(.*)"], // Middleware for Admin and Employee paths
};
