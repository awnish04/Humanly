/**
 * Visitor Tracking Utilities - Database Storage (Vercel Compatible)
 * Handles visitor data collection using Neon PostgreSQL
 * Works on Vercel serverless functions!
 */

import { db } from "@/lib/db";
import { visitors, clicks } from "@/lib/db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export interface VisitorData {
  id: string;
  visitId: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  device: string;
  os: string;
  browser: string;
  browserVersion: string;
  userAgent: string;
  referrer: string;
  page: string;
  timestamp: number;
  sessionId: string;
  isNewVisitor: boolean;
  visitCount: number;
  timeSpent?: number;
}

export interface ClickData {
  id: string;
  visitorId: string;
  sessionId: string;
  page: string;
  elementType: string;
  elementText: string;
  elementId?: string;
  elementClass?: string;
  xPosition: number;
  yPosition: number;
  timestamp: number;
  country: string;
  countryCode: string;
  device: string;
  os: string;
  browser: string;
}

export interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  countries: number;
  topCountries: Array<{ country: string; countryCode: string; count: number }>;
  topPages: Array<{ page: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
  recentVisitors: VisitorData[];
  dailyVisits: Array<{ date: string; visits: number }>;
  returningVisitors: number;
  newVisitors: number;
}

/**
 * Get visitor's IP address from request headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const cfConnectingIp = headers.get("cf-connecting-ip");

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return "unknown";
}

/**
 * Get geolocation data from IP address (free API, no key needed)
 */
export async function getGeoLocation(ip: string) {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,timezone,lat,lon`,
    );

    if (!response.ok) throw new Error("Geolocation API failed");

    const data = await response.json();

    if (data.status === "fail") {
      return {
        country: "Unknown",
        countryCode: "XX",
        city: "Unknown",
        region: "Unknown",
        timezone: "UTC",
        latitude: null,
        longitude: null,
      };
    }

    return {
      country: data.country || "Unknown",
      countryCode: data.countryCode || "XX",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      timezone: data.timezone || "UTC",
      latitude: data.lat || null,
      longitude: data.lon || null,
    };
  } catch (error) {
    console.error("Geolocation error:", error);
    return {
      country: "Unknown",
      countryCode: "XX",
      city: "Unknown",
      region: "Unknown",
      timezone: "UTC",
      latitude: null,
      longitude: null,
    };
  }
}

/**
 * Parse user agent to detect device, OS, and browser
 */
export function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();

  // Detect device type
  let device = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    device = "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      userAgent,
    )
  ) {
    device = "mobile";
  }

  // Detect OS
  let os = "Unknown";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    os = "iOS";
    const iosVersion = userAgent.match(/OS (\d+)[_.](\d+)/i);
    if (iosVersion) os = `iOS ${iosVersion[1]}.${iosVersion[2]}`;
  } else if (ua.includes("android")) {
    os = "Android";
    const androidVersion = userAgent.match(/Android (\d+\.?\d*)/i);
    if (androidVersion) os = `Android ${androidVersion[1]}`;
  } else if (ua.includes("windows nt 10.0")) {
    os = "Windows 10/11";
  } else if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("mac os x")) {
    const macVersion = userAgent.match(/Mac OS X (\d+)[_.](\d+)/i);
    if (macVersion) {
      const major = parseInt(macVersion[1]);
      if (major >= 11) os = `macOS ${major}`;
      else os = "macOS";
    } else {
      os = "macOS";
    }
  } else if (ua.includes("linux")) {
    if (ua.includes("ubuntu")) os = "Ubuntu";
    else if (ua.includes("fedora")) os = "Fedora";
    else os = "Linux";
  } else if (ua.includes("cros")) {
    os = "Chrome OS";
  }

  // Detect browser
  let browser = "Unknown";
  let browserVersion = "";

  if (ua.includes("edg/")) {
    browser = "Edge";
    browserVersion = userAgent.match(/edg\/([\d.]+)/i)?.[1] || "";
  } else if (ua.includes("opr/") || ua.includes("opera/")) {
    browser = "Opera";
    browserVersion = userAgent.match(/(?:opera|opr)\/([\d.]+)/i)?.[1] || "";
  } else if (ua.includes("firefox/")) {
    browser = "Firefox";
    browserVersion = userAgent.match(/firefox\/([\d.]+)/i)?.[1] || "";
  } else if (ua.includes("safari/") && !ua.includes("chrome")) {
    browser = "Safari";
    browserVersion = userAgent.match(/version\/([\d.]+)/i)?.[1] || "";
  } else if (ua.includes("chrome/")) {
    browser = "Chrome";
    browserVersion = userAgent.match(/chrome\/([\d.]+)/i)?.[1] || "";
  }

  return { device, os, browser, browserVersion };
}

/**
 * Generate a unique visitor ID based on IP and user agent
 */
export async function generateVisitorId(
  ip: string,
  userAgent: string,
): Promise<string> {
  const data = `${ip}-${userAgent}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex.substring(0, 16);
}

/**
 * Track a visitor (database version)
 */
export async function trackVisitor(
  data: Omit<VisitorData, "id" | "visitCount" | "isNewVisitor" | "visitId">,
): Promise<VisitorData | null> {
  try {
    const visitorId = await generateVisitorId(data.ip, data.userAgent);

    // Check if visitor exists
    const existingVisitors = await db
      .select()
      .from(visitors)
      .where(eq(visitors.id, visitorId))
      .limit(1);

    const existingVisitor = existingVisitors[0];
    const isNewVisitor = !existingVisitor;
    const visitCount = existingVisitor ? existingVisitor.visitCount + 1 : 1;

    // Generate unique visit ID
    const visitId = `${visitorId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const visitorData = {
      id: visitorId,
      visitId,
      ip: data.ip,
      country: data.country,
      countryCode: data.countryCode,
      city: data.city,
      region: data.region,
      timezone: data.timezone,
      latitude: data.latitude?.toString() || null,
      longitude: data.longitude?.toString() || null,
      device: data.device,
      os: data.os,
      browser: data.browser,
      browserVersion: data.browserVersion,
      userAgent: data.userAgent,
      referrer: data.referrer,
      page: data.page,
      sessionId: data.sessionId,
      isNewVisitor,
      visitCount,
      timeSpent: null,
      timestamp: new Date(),
    };

    // Insert visitor record
    await db.insert(visitors).values(visitorData);

    return {
      ...data,
      id: visitorId,
      visitId,
      isNewVisitor,
      visitCount,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return null;
  }
}

/**
 * Track a click event (database version)
 */
export async function trackClick(data: Omit<ClickData, "id">): Promise<void> {
  try {
    const clickId = `click-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    await db.insert(clicks).values({
      id: clickId,
      visitorId: data.visitorId,
      sessionId: data.sessionId,
      page: data.page,
      elementType: data.elementType,
      elementText: data.elementText || "",
      elementId: data.elementId || null,
      elementClass: data.elementClass || null,
      xPosition: data.xPosition,
      yPosition: data.yPosition,
      country: data.country,
      countryCode: data.countryCode,
      device: data.device,
      os: data.os,
      browser: data.browser,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error tracking click:", error);
  }
}

/**
 * Get visitor statistics (database version)
 */
export async function getVisitorStats(days: number = 7) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    // Get total and unique visitors
    const totalVisits = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors);

    const uniqueVisitors = await db
      .select({ count: sql<number>`count(DISTINCT ${visitors.id})` })
      .from(visitors);

    // Get new vs returning visitors
    const newVisitors = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(eq(visitors.isNewVisitor, true));

    const returningVisitors = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors)
      .where(eq(visitors.isNewVisitor, false));

    // Get top countries
    const topCountries = await db
      .select({
        country: visitors.country,
        countryCode: visitors.countryCode,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .groupBy(visitors.country, visitors.countryCode)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get top pages
    const topPages = await db
      .select({
        page: visitors.page,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .groupBy(visitors.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get top devices
    const topDevices = await db
      .select({
        device: visitors.device,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .groupBy(visitors.device)
      .orderBy(desc(sql`count(*)`));

    // Get top browsers
    const topBrowsers = await db
      .select({
        browser: visitors.browser,
        count: sql<number>`count(*)`,
      })
      .from(visitors)
      .groupBy(visitors.browser)
      .orderBy(desc(sql`count(*)`));

    // Get recent visitors
    const recentVisitors = await db
      .select()
      .from(visitors)
      .orderBy(desc(visitors.timestamp))
      .limit(50);

    // Get daily visits for last N days
    const dailyVisits = await db
      .select({
        date: sql<string>`DATE(${visitors.timestamp})`,
        visits: sql<number>`count(*)`,
      })
      .from(visitors)
      .where(gte(visitors.timestamp, daysAgo))
      .groupBy(sql`DATE(${visitors.timestamp})`)
      .orderBy(sql`DATE(${visitors.timestamp})`);

    return {
      totalVisitors: Number(totalVisits[0]?.count || 0),
      uniqueVisitors: Number(uniqueVisitors[0]?.count || 0),
      pageViews: Number(totalVisits[0]?.count || 0),
      countries: topCountries.length,
      topCountries: topCountries.map((c) => ({
        country: c.country,
        countryCode: c.countryCode,
        count: Number(c.count),
      })),
      topPages: topPages.map((p) => ({
        page: p.page,
        count: Number(p.count),
      })),
      topDevices: topDevices.map((d) => ({
        device: d.device,
        count: Number(d.count),
      })),
      topBrowsers: topBrowsers.map((b) => ({
        browser: b.browser,
        count: Number(b.count),
      })),
      recentVisitors: recentVisitors.map((v) => ({
        id: v.id,
        visitId: v.visitId,
        ip: v.ip,
        country: v.country,
        countryCode: v.countryCode,
        city: v.city,
        region: v.region,
        timezone: v.timezone,
        latitude: v.latitude ? parseFloat(v.latitude) : null,
        longitude: v.longitude ? parseFloat(v.longitude) : null,
        device: v.device,
        os: v.os,
        browser: v.browser,
        browserVersion: v.browserVersion,
        userAgent: v.userAgent,
        referrer: v.referrer,
        page: v.page,
        sessionId: v.sessionId,
        isNewVisitor: v.isNewVisitor,
        visitCount: v.visitCount,
        timeSpent: v.timeSpent || undefined,
        timestamp: v.timestamp.getTime(),
      })),
      dailyVisits: dailyVisits.map((d) => ({
        date: d.date,
        visits: Number(d.visits),
      })),
      returningVisitors: Number(returningVisitors[0]?.count || 0),
      newVisitors: Number(newVisitors[0]?.count || 0),
    };
  } catch (error) {
    console.error("Error getting visitor stats:", error);
    return {
      totalVisitors: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      countries: 0,
      topCountries: [],
      topPages: [],
      topDevices: [],
      topBrowsers: [],
      recentVisitors: [],
      dailyVisits: [],
      returningVisitors: 0,
      newVisitors: 0,
    };
  }
}

/**
 * Get click statistics (database version)
 */
export async function getClickStats(days: number = 7) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    // Get total clicks
    const totalClicks = await db
      .select({ count: sql<number>`count(*)` })
      .from(clicks);

    // Get daily clicks
    const dailyClicks = await db
      .select({
        date: sql<string>`DATE(${clicks.timestamp})`,
        count: sql<number>`count(*)`,
      })
      .from(clicks)
      .where(gte(clicks.timestamp, daysAgo))
      .groupBy(sql`DATE(${clicks.timestamp})`)
      .orderBy(sql`DATE(${clicks.timestamp})`);

    // Get top pages
    const topPages = await db
      .select({
        page: clicks.page,
        count: sql<number>`count(*)`,
      })
      .from(clicks)
      .groupBy(clicks.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get top elements
    const topElements = await db
      .select({
        element: clicks.elementType,
        count: sql<number>`count(*)`,
      })
      .from(clicks)
      .groupBy(clicks.elementType)
      .orderBy(desc(sql`count(*)`));

    // Get recent clicks
    const recentClicks = await db
      .select()
      .from(clicks)
      .orderBy(desc(clicks.timestamp))
      .limit(50);

    return {
      totalClicks: Number(totalClicks[0]?.count || 0),
      dailyClicks: dailyClicks.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
      topPages: topPages.map((p) => ({
        page: p.page,
        count: Number(p.count),
      })),
      topElements: topElements.map((e) => ({
        element: e.element,
        count: Number(e.count),
      })),
      recentClicks: recentClicks.map((c) => ({
        id: c.id,
        visitorId: c.visitorId,
        sessionId: c.sessionId,
        page: c.page,
        elementType: c.elementType,
        elementText: c.elementText || "",
        elementId: c.elementId || undefined,
        elementClass: c.elementClass || undefined,
        xPosition: c.xPosition,
        yPosition: c.yPosition,
        country: c.country,
        countryCode: c.countryCode,
        device: c.device,
        os: c.os,
        browser: c.browser,
        timestamp: c.timestamp.getTime(),
      })),
    };
  } catch (error) {
    console.error("Error getting click stats:", error);
    return {
      totalClicks: 0,
      dailyClicks: [],
      topPages: [],
      topElements: [],
      recentClicks: [],
    };
  }
}

/**
 * Update time spent on page (database version)
 */
export async function updateTimeSpent(
  visitId: string,
  timeSpent: number,
): Promise<void> {
  try {
    await db
      .update(visitors)
      .set({ timeSpent })
      .where(eq(visitors.visitId, visitId));
  } catch (error) {
    console.error("Error updating time spent:", error);
  }
}
