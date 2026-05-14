/**
 * POST /api/detect/text
 * Detect AI-generated content in text
 *
 * ZeroGPT-style endpoint with standardized response format
 */

import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  CommonErrors,
  ErrorCodes,
} from "@/lib/api-response";

// Configuration
const MAX_WORDS = 5000;
const MIN_WORDS = 10;

interface DetectTextRequest {
  text: string;
  options?: {
    detailed?: boolean; // Include sentence-level analysis
    sentenceLevel?: boolean; // Highlight AI sentences
  };
}

interface DetectTextResponse {
  id: string;
  aiPercentage: number;
  humanPercentage: number;
  assistedPercentage: number;
  aiWords: number;
  totalWords: number;
  sentences?: Array<{
    text: string;
    aiProbability: number;
    isAI: boolean;
  }>;
  detectors?: {
    sapling?: number;
    zerogpt?: number;
    local?: number;
  };
  processingTime: number;
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/**
 * Generate unique detection ID
 */
function generateDetectionId(): string {
  return `det_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Local heuristic AI detection (fallback)
 */
function localDetection(text: string): {
  ai: number;
  assisted: number;
  human: number;
} {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  let score = 0;

  // Sentence length variance
  if (sentences.length > 0) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    if (variance < 10) score += 25;
    else if (variance < 25) score += 10;
  }

  // AI phrases detection
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

  // Contraction usage
  const words = text.trim().split(/\s+/).length;
  if ((text.match(/\b\w+'\w+\b/g) ?? []).length / words < 0.01) score += 15;

  // Personal pronouns
  if ((text.match(/\b(I|we|my|our)\b/g) ?? []).length === 0) score += 10;

  const ai = Math.min(score, 95);
  const assisted = Math.min(Math.max(100 - ai - 20, 0), 30);
  const human = Math.max(100 - ai - assisted, 0);

  return { ai, assisted, human };
}

/**
 * Detect AI using Sapling API
 */
async function saplingDetection(
  text: string,
): Promise<{ ai: number; assisted: number; human: number } | null> {
  const apiKey = process.env.SAPLING_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: apiKey, text }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { score: number };
    const aiRaw = Math.round(data.score * 100);
    const ai = Math.min(Math.max(aiRaw, 0), 100);
    const assisted = Math.round(Math.min(ai * 0.4, 40));
    const human = Math.max(100 - ai - assisted, 0);

    return { ai, assisted, human };
  } catch {
    return null;
  }
}

/**
 * Detect AI using ZeroGPT API
 */
async function zerogptDetection(
  text: string,
): Promise<{ ai: number; assisted: number; human: number } | null> {
  const apiKey = process.env.ZEROGPT_API_KEY;

  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.zerogpt.com/api/detect/detectText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApiKey: apiKey,
      },
      body: JSON.stringify({ input_text: text }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data.success && data.data) {
      const ai = Math.round(data.data.fakePercentage || 0);
      const assisted = Math.round(Math.min(ai * 0.3, 30));
      const human = Math.max(100 - ai - assisted, 0);

      return { ai, assisted, human };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Analyze sentences for AI probability
 */
function analyzeSentences(
  text: string,
  aiPercentage: number,
): Array<{ text: string; aiProbability: number; isAI: boolean }> {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  return sentences.map((sentence) => {
    const trimmed = sentence.trim();
    let probability = aiPercentage / 100;

    // Adjust based on sentence characteristics
    const words = trimmed.split(/\s+/).length;
    if (words > 25) probability += 0.1; // Long sentences more likely AI
    if (words < 5) probability -= 0.1; // Short sentences less likely AI

    // Check for AI phrases
    const aiPhrases = [
      /\bit is important to note\b/i,
      /\bfurthermore\b/i,
      /\bmoreover\b/i,
      /\bin conclusion\b/i,
    ];
    if (aiPhrases.some((p) => p.test(trimmed))) probability += 0.15;

    // Clamp probability
    probability = Math.max(0, Math.min(1, probability));

    return {
      text: trimmed,
      aiProbability: Math.round(probability * 100) / 100,
      isAI: probability > 0.5,
    };
  });
}

/**
 * Main detection handler
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = (await req.json()) as DetectTextRequest;
    const { text, options = {} } = body;

    // Validate input
    if (!text || typeof text !== "string") {
      return CommonErrors.missingField("text");
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return errorResponse(
        "Text cannot be empty",
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    // Check word count
    const wordCount = countWords(trimmedText);

    if (wordCount < MIN_WORDS) {
      return CommonErrors.textTooShort(MIN_WORDS);
    }

    if (wordCount > MAX_WORDS) {
      return CommonErrors.textTooLong(MAX_WORDS);
    }

    // Try detection services in order of preference
    let result: { ai: number; assisted: number; human: number } | null = null;
    const detectorScores: {
      sapling?: number;
      zerogpt?: number;
      local?: number;
    } = {};

    // 1. Try ZeroGPT (most accurate, but paid)
    const zerogptResult = await zerogptDetection(trimmedText);
    if (zerogptResult) {
      result = zerogptResult;
      detectorScores.zerogpt = zerogptResult.ai;
    }

    // 2. Try Sapling (free tier available)
    if (!result) {
      const saplingResult = await saplingDetection(trimmedText);
      if (saplingResult) {
        result = saplingResult;
        detectorScores.sapling = saplingResult.ai;
      }
    }

    // 3. Fallback to local heuristic
    if (!result) {
      result = localDetection(trimmedText);
      detectorScores.local = result.ai;
    }

    // Calculate AI words
    const aiWords = Math.round((wordCount * result.ai) / 100);

    // Build response
    const response: DetectTextResponse = {
      id: generateDetectionId(),
      aiPercentage: result.ai,
      humanPercentage: result.human,
      assistedPercentage: result.assisted,
      aiWords,
      totalWords: wordCount,
      detectors: detectorScores,
      processingTime: (Date.now() - startTime) / 1000,
    };

    // Add sentence-level analysis if requested
    if (options.detailed || options.sentenceLevel) {
      response.sentences = analyzeSentences(trimmedText, result.ai);
    }

    return successResponse(response, "Detection completed successfully");
  } catch (error) {
    console.error("Detection error:", error);
    return CommonErrors.internalError();
  }
}
