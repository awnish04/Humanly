import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = (await req.json()) as { text: string };

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const apiKey = process.env.REWRITE_API_KEY?.replace(/^["']|["']$/g, "");
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://rewriteai.com/api/v1/humanize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text }),
    });

    const raw = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: raw || `Error ${res.status}` },
        { status: res.status },
      );
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json({
        results: [{ text: raw }],
        wordsUsed: text.trim().split(/\s+/).length,
      });
    }

    // RewriteAI returns { results: [{text: string}, ...], wordsUsed: number }
    const results = (data.results as { text: string }[]) ?? [];
    const wordsUsed =
      (data.wordsUsed as number) ?? text.trim().split(/\s+/).length;

    if (!results.length) {
      return NextResponse.json(
        { error: "No results returned" },
        { status: 500 },
      );
    }

    return NextResponse.json({ results, wordsUsed });
  } catch (err) {
    console.error("RewriteAI fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach humanization service" },
      { status: 502 },
    );
  }
}
