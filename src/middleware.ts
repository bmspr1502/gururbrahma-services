import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  const idToken = request.cookies.get("idToken")?.value;

  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    if (!idToken) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
