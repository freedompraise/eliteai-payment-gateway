import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const searchParams = nextUrl.searchParams;

  console.log("pathname: ", pathname);
  console.log("searchParams: ", searchParams.toString());

  // Check if the pathname is "/" and the search parameter is "ref"
  if (pathname === "/" && searchParams.has("ref")) {
    const newUrl = new URL(nextUrl);
    newUrl.pathname = "/free_training/";
    console.log("newUrl: ", newUrl);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next(); // Continue with the response if no redirect is needed
}

// Specify the routes where this middleware should run
export const config = {
  matcher: "/",
};
