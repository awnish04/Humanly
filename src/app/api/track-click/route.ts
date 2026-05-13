/**
 * API Route: Track Click
 * POST /api/track-click
 * Tracks user click events on pages
 */

import { NextRequest, NextResponse } from "next/server";
import { trackClick } from "@/lib/visitor-tracking";
import {
  getClientIp,
  getGeoLocation,
  parseUserAgent,
} from "@/lib/visitor-tracking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      page,
      elementType,
      elementText,
      elementId,
      elementClass,
      xPosition,
      yPosition,
    } = body;

    // Get visitor information
    const ip = getClientIp(request.headers);
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Get geolocation data
    const geoData = await getGeoLocation(ip);

    // Parse user agent for device/browser info
    const { device, os, browser } = parseUserAgent(userAgent);

    // Generate visitor ID and session ID from cookies/headers if available
    const visitorId = request.cookies.get("visitor_id")?.value || "unknown";
    const sessionId = request.cookies.get("session_id")?.value || "unknown";

    await trackClick({
      visitorId,
      sessionId,
      page: page || "/",
      elementType: elementType || "unknown",
      elementText: elementText || "",
      elementId,
      elementClass,
      xPosition: xPosition || 0,
      yPosition: yPosition || 0,
      timestamp: Date.now(),
      country: geoData.country,
      countryCode: geoData.countryCode,
      device,
      os,
      browser,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track click" },
      { status: 500 },
    );
  }
}
