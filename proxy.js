export { default } from "next-auth/middleware";
import { NextResponse } from "next/server";

export function proxy(request) {
  return NextResponse.redirect(new URL("/private", request.url));
}

export const config = { matcher: ["/private/:path*"] };
