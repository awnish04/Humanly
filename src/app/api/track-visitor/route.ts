/**
 * API Route: Track Visitor
 * POST /api/track-visitor
 * Tracks website visitors with IP, location, device info
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getClientIp,
  getGeoLocation,
  parseUserAgent,
  trackVisitor,
} from "@/lib/visitor-tracking-db";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, sessionId, isBrave } = body;

    // Get visitor information
    const ip = getClientIp(request.headers);
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get geolocation data
    const geoData = await getGeoLocation(ip);

    // Parse user agent for device/browser info
    const { device, os, browser, browserVersion } = parseUserAgent(userAgent);

    // Override browser if Brave was detected client-side
    const finalBrowser = isBrave ? "Brave" : browser;

    // Track the visitor and get the visit data
    const visitData = await trackVisitor({
      ip,
      country: geoData.country,
      countryCode: geoData.countryCode,
      city: geoData.city,
      region: geoData.region,
      timezone: geoData.timezone,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      device,
      os,
      browser: finalBrowser,
      browserVersion,
      userAgent,
      referrer: referrer || "direct",
      page: page || "/",
      timestamp: Date.now(),
      sessionId: sessionId || "",
    });

    return NextResponse.json({ success: true, visitId: visitData?.visitId });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track visitor" },
      { status: 500 },
    );
  }
}
