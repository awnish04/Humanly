import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/detect
 * Detects AI content using Sapling.ai's free detection API.
 * Returns { ai, assisted, human } as percentages (0-100).
 *
 * Sapling returns a score 0.0–1.0 where 1.0 = fully AI-generated.
 * We map that to our three-bucket breakdown.
 */
export async function POST(req: NextRequest) {
  const { text } = (await req.json()) as { text: string };

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const apiKey = process.env.SAPLING_API_KEY;

  // If no Sapling key configured, fall back to local heuristic
  if (!apiKey) {
    return NextResponse.json(localEstimate(text));
  }

  try {
    const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: apiKey, text }),
    });

    if (!res.ok) {
      // Fall back to heuristic on API error
      return NextResponse.json(localEstimate(text));
    }

    const data = (await res.json()) as { score: number };
    // score: 0.0 = human, 1.0 = AI
    const aiRaw = Math.round(data.score * 100);
    return NextResponse.json(breakdown(aiRaw));
  } catch {
    return NextResponse.json(localEstimate(text));
  }
}

/** Map a raw AI% into the three-bucket breakdown */
function breakdown(ai: number): {
  ai: number;
  assisted: number;
  human: number;
} {
  const clamped = Math.min(Math.max(ai, 0), 100);
  // "assisted" is a middle band — peaks around 50% AI score
  const assisted = Math.round(Math.min(clamped * 0.4, 40));
  const human = Math.max(100 - clamped - assisted, 0);
  return { ai: clamped, assisted, human };
}

/** Local heuristic fallback (no external API needed) */
function localEstimate(text: string): {
  ai: number;
  assisted: number;
  human: number;
} {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  let score = 0;

  if (sentences.length > 0) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    if (variance < 10) score += 25;
    else if (variance < 25) score += 10;
  }

  const aiPhrases = [
    /\bit is important to note\b/i,
    /\bfurthermore\b/i,
    /\bmoreover\b/i,
    /\bin conclusion\b/i,
    /\bin summary\b/i,
    /\boverall\b/i,
    /\bsignificant(ly)?\b/i,
    /\bultimately\b/i,
    /\bnevertheless\b/i,
    /\bin addition\b/i,
  ];
  score += Math.min(aiPhrases.filter((p) => p.test(text)).length * 8, 40);

  const words = text.trim().split(/\s+/).length;
  if ((text.match(/\b\w+'\w+\b/g) ?? []).length / words < 0.01) score += 15;
  if ((text.match(/\b(I|we|my|our)\b/g) ?? []).length === 0) score += 10;

  return breakdown(Math.min(score, 95));
}
