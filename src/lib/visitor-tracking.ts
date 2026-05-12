/**
 * Visitor Tracking Utilities - File-based Storage
 * Handles visitor data collection using local JSON files
 * 100% FREE - No external services required!
 */

import { promises as fs } from "fs";
import path from "path";

// Data directory for storing visitor data
const DATA_DIR = path.join(process.cwd(), "data", "analytics");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's fine
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      console.error("Failed to create data directory:", error);
    }
  }
}

export interface VisitorData {
  id: string;
  visitId: string; // Unique per page visit
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
  timeSpent?: number; // Time spent on page in seconds
}

export interface ClickData {
  id: string;
  visitorId: string;
  sessionId: string;
  page: string;
  elementType: string; // button, link, input, etc.
  elementText: string;
  elementId?: string;
  elementClass?: string;
  xPosition: number;
  yPosition: number;
  timestamp: number;
  country: string;
  countryCode: string;
  device: string;
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
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  // Detect browser (order matters - check specific browsers first!)
  let browser = "Unknown";
  let browserVersion = "";

  // Check for Brave first (Brave doesn't have "brave" in UA, but we can detect it via navigator.brave)
  // Since we're server-side, we'll check for Brave's Chromium signature
  // Note: Brave is hard to detect server-side, but we can try
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
    // Brave uses Chrome UA, so we'll label Chromium-based browsers as "Chrome/Brave"
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
 * Read JSON file safely
 */
async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

/**
 * Write JSON file safely
 */
async function writeJsonFile(filename: string, data: unknown): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write ${filename}:`, error);
  }
}

/**
 * Track a visitor
 */
export async function trackVisitor(
  data: Omit<VisitorData, "id" | "visitCount" | "isNewVisitor" | "visitId">,
): Promise<VisitorData | null> {
  try {
    await ensureDataDir();

    const visitorId = await generateVisitorId(data.ip, data.userAgent);

    // Read existing visitors
    const visitors = await readJsonFile<Record<string, VisitorData>>(
      "visitors.json",
      {},
    );

    // Check if visitor exists
    const existingVisitor = visitors[visitorId];
    const isNewVisitor = !existingVisitor;
    const visitCount = existingVisitor ? existingVisitor.visitCount + 1 : 1;

    // Generate unique visit ID for this specific page visit
    const visitId = `${visitorId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const visitorData: VisitorData = {
      ...data,
      id: visitorId,
      visitId, // Unique per visit
      isNewVisitor,
      visitCount,
    };

    // Update visitor data
    visitors[visitorId] = visitorData;
    await writeJsonFile("visitors.json", visitors);

    // Update recent visitors (keep last 100)
    const recentVisitors = await readJsonFile<VisitorData[]>(
      "recent-visitors.json",
      [],
    );
    recentVisitors.unshift(visitorData);
    if (recentVisitors.length > 100) {
      recentVisitors.pop();
    }
    await writeJsonFile("recent-visitors.json", recentVisitors);

    // Update stats
    const stats = await readJsonFile<{
      totalVisits: number;
      uniqueVisitors: number;
      newVisitors: number;
      returningVisitors: number;
      countries: Record<string, { count: number; countryCode: string }>;
      pages: Record<string, number>;
      devices: Record<string, number>;
      browsers: Record<string, number>;
      daily: Record<string, number>;
    }>("stats.json", {
      totalVisits: 0,
      uniqueVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      countries: {},
      pages: {},
      devices: {},
      browsers: {},
      daily: {},
    });

    stats.totalVisits = (stats.totalVisits || 0) + 1;

    if (isNewVisitor) {
      stats.uniqueVisitors = (stats.uniqueVisitors || 0) + 1;
      stats.newVisitors = (stats.newVisitors || 0) + 1;
    } else {
      stats.returningVisitors = (stats.returningVisitors || 0) + 1;
    }

    // Track by country (store both name and code)
    stats.countries = stats.countries || {};
    const countryKey = data.country;
    if (!stats.countries[countryKey]) {
      stats.countries[countryKey] = { count: 0, countryCode: data.countryCode };
    }
    stats.countries[countryKey].count += 1;

    // Track by page
    stats.pages = stats.pages || {};
    stats.pages[data.page] = (stats.pages[data.page] || 0) + 1;

    // Track by device
    stats.devices = stats.devices || {};
    stats.devices[data.device] = (stats.devices[data.device] || 0) + 1;

    // Track by browser
    stats.browsers = stats.browsers || {};
    stats.browsers[data.browser] = (stats.browsers[data.browser] || 0) + 1;

    // Track daily visits
    const today = new Date().toISOString().split("T")[0];
    stats.daily = stats.daily || {};
    stats.daily[today] = (stats.daily[today] || 0) + 1;

    await writeJsonFile("stats.json", stats);

    return visitorData;
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return null;
  }
}

/**
 * Get visitor statistics
 */
export async function getVisitorStats(days: number = 7): Promise<VisitorStats> {
  try {
    await ensureDataDir();

    // Read stats
    const stats = await readJsonFile<{
      totalVisits: number;
      uniqueVisitors: number;
      newVisitors: number;
      returningVisitors: number;
      countries: Record<string, { count: number; countryCode: string }>;
      pages: Record<string, number>;
      devices: Record<string, number>;
      browsers: Record<string, number>;
      daily: Record<string, number>;
    }>("stats.json", {
      totalVisits: 0,
      uniqueVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      countries: {},
      pages: {},
      devices: {},
      browsers: {},
      daily: {},
    });

    // Read recent visitors
    const recentVisitors = await readJsonFile<VisitorData[]>(
      "recent-visitors.json",
      [],
    );

    // Convert objects to sorted arrays
    const topCountries = Object.entries(stats.countries || {})
      .map(([country, data]) => ({
        country,
        countryCode: data.countryCode,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topPages = Object.entries(stats.pages || {})
      .map(([page, count]) => ({ page, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topDevices = Object.entries(stats.devices || {})
      .map(([device, count]) => ({ device, count: count as number }))
      .sort((a, b) => b.count - a.count);

    const topBrowsers = Object.entries(stats.browsers || {})
      .map(([browser, count]) => ({ browser, count: count as number }))
      .sort((a, b) => b.count - a.count);

    // Get daily visits for the last N days
    const dailyVisits = Object.entries(stats.daily || {})
      .map(([date, visits]) => ({ date, visits: visits as number }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, days)
      .reverse();

    return {
      totalVisitors: stats.totalVisits || 0,
      uniqueVisitors: stats.uniqueVisitors || 0,
      pageViews: stats.totalVisits || 0,
      countries: topCountries.length,
      topCountries,
      topPages,
      topDevices,
      topBrowsers,
      recentVisitors: recentVisitors.slice(0, 50),
      dailyVisits,
      returningVisitors: stats.returningVisitors || 0,
      newVisitors: stats.newVisitors || 0,
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
 * Track a click event
 */
export async function trackClick(data: Omit<ClickData, "id">): Promise<void> {
  try {
    await ensureDataDir();

    const clickId = `click-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const clickData: ClickData = {
      ...data,
      id: clickId,
    };

    // Read existing clicks
    const clicks = await readJsonFile<ClickData[]>("clicks.json", []);

    // Add new click (keep last 1000)
    clicks.unshift(clickData);
    if (clicks.length > 1000) {
      clicks.pop();
    }

    await writeJsonFile("clicks.json", clicks);

    // Update click stats
    const clickStats = await readJsonFile<{
      totalClicks: number;
      byPage: Record<string, number>;
      byElement: Record<string, number>;
      daily: Record<string, number>;
    }>("click-stats.json", {
      totalClicks: 0,
      byPage: {},
      byElement: {},
      daily: {},
    });

    clickStats.totalClicks = (clickStats.totalClicks || 0) + 1;

    // Track by page
    clickStats.byPage = clickStats.byPage || {};
    clickStats.byPage[data.page] = (clickStats.byPage[data.page] || 0) + 1;

    // Track by element type
    clickStats.byElement = clickStats.byElement || {};
    clickStats.byElement[data.elementType] =
      (clickStats.byElement[data.elementType] || 0) + 1;

    // Track daily clicks
    const today = new Date().toISOString().split("T")[0];
    clickStats.daily = clickStats.daily || {};
    clickStats.daily[today] = (clickStats.daily[today] || 0) + 1;

    await writeJsonFile("click-stats.json", clickStats);
  } catch (error) {
    console.error("Error tracking click:", error);
  }
}

/**
 * Get click statistics
 */
export async function getClickStats(days: number = 7) {
  try {
    await ensureDataDir();

    const clickStats = await readJsonFile<{
      totalClicks: number;
      byPage: Record<string, number>;
      byElement: Record<string, number>;
      daily: Record<string, number>;
    }>("click-stats.json", {
      totalClicks: 0,
      byPage: {},
      byElement: {},
      daily: {},
    });

    const clicks = await readJsonFile<ClickData[]>("clicks.json", []);

    // Get daily clicks for the last N days
    const dailyClicks = Object.entries(clickStats.daily || {})
      .map(([date, count]) => ({ date, count: count as number }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, days)
      .reverse();

    const topPages = Object.entries(clickStats.byPage || {})
      .map(([page, count]) => ({ page, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topElements = Object.entries(clickStats.byElement || {})
      .map(([element, count]) => ({ element, count: count as number }))
      .sort((a, b) => b.count - a.count);

    return {
      totalClicks: clickStats.totalClicks || 0,
      dailyClicks,
      topPages,
      topElements,
      recentClicks: clicks.slice(0, 50),
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
 * Update time spent on page
 */
export async function updateTimeSpent(
  visitId: string,
  timeSpent: number,
): Promise<void> {
  try {
    await ensureDataDir();

    // Update in recent visitors
    const recentVisitors = await readJsonFile<VisitorData[]>(
      "recent-visitors.json",
      [],
    );

    const visitorIndex = recentVisitors.findIndex((v) => v.visitId === visitId);
    if (visitorIndex !== -1) {
      recentVisitors[visitorIndex].timeSpent = timeSpent;
      await writeJsonFile("recent-visitors.json", recentVisitors);
    }
  } catch (error) {
    console.error("Error updating time spent:", error);
  }
}
