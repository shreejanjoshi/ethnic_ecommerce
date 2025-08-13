import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import { geolocation } from "@vercel/functions";
import countries from "@/data/countries.json";
import { Country } from "./lib/types";
import { getUserCountry } from "./lib/utils";

export default clerkMiddleware(async (auth, req, next) => {
  const protectedRoutes = createRouteMatcher([
    "/dashboard",
    "/dashboard/(.*)",
    "/checkout",
    "/profile",
    "/profile/(.*)",
  ]);

  if (protectedRoutes(req)) {
    await auth.protect();
  }

  // Creating a basic response
  let response = NextResponse.next();

  /*---------Handle Country detection----------*/
  // Step 1: Check if country is already set in cookies
  const countryCookie = req.cookies.get("userCountry");

  const DEFAULT_COUNTRY: Country = {
    name: "Belgium",
    code: "BE",
    city: "",
    region: "",
  };

  if (countryCookie) {
    // If the user has already selected a country, use that for subsequent requests
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL(req.url));
    const userCountry = await getUserCountry();

    // Step 2: Get the user country using the helper function
    // const geo = geolocation(req);
    // let userCountry = {
    //   name:
    //     countries.find((c) => c.code === geo.country)?.name ||
    //     DEFAULT_COUNTRY.name,
    //   code: geo.country || DEFAULT_COUNTRY.code,
    //   city: geo.city || DEFAULT_COUNTRY.city,
    //   region: geo.region || DEFAULT_COUNTRY.region,
    // };
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
