import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "./utils/session";

export async function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname.startsWith("/protected")) {
      const session = await getSession();
      if (!session) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return await updateSession(request);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: ["/protected/:path*", "/api/:path*"],
};