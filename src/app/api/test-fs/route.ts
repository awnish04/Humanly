/**
 * Test Filesystem Access
 * GET /api/test-fs
 */

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data", "analytics");

    console.log("Testing filesystem access...");
    console.log("Data directory:", dataDir);
    console.log("Current working directory:", process.cwd());

    // Try to create directory
    await fs.mkdir(dataDir, { recursive: true });
    console.log("✅ Directory created/exists");

    // Try to write a test file
    const testFile = path.join(dataDir, "test.json");
    await fs.writeFile(testFile, JSON.stringify({ test: true }), "utf-8");
    console.log("✅ Test file written");

    // Try to read it back
    const content = await fs.readFile(testFile, "utf-8");
    console.log("✅ Test file read:", content);

    // Clean up
    await fs.unlink(testFile);
    console.log("✅ Test file deleted");

    return NextResponse.json({
      success: true,
      message: "Filesystem access works!",
      dataDir,
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error("❌ Filesystem test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
