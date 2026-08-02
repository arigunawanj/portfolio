import { NextRequest, NextResponse } from "next/server"
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth"

export const config = {
  matcher: ["/admin/:path*"],
}

export async function middleware(request: NextRequest) {
  const response = await handle(request)
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
  return response
}

async function handle(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
