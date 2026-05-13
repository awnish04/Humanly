/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Standardized API Response Format (ZeroGPT-style)
 * All API endpoints should use this format for consistency
 */

import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  data: T | null;
  message: string;
  error?: {
    code: string;
    details?: any;
  };
}

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  code: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      code,
      data,
      message,
    },
    { status: code },
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  message: string,
  code: number = 400,
  errorCode?: string,
  errorDetails?: any,
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      code,
      data: null,
      message,
      error: errorCode
        ? {
            code: errorCode,
            details: errorDetails,
          }
        : undefined,
    },
    { status: code },
  );
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Authentication errors (401)
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  MISSING_TOKEN: "MISSING_TOKEN",

  // Authorization errors (403)
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  ADMIN_ONLY: "ADMIN_ONLY",

  // Validation errors (400)
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",
  TEXT_TOO_LONG: "TEXT_TOO_LONG",
  TEXT_TOO_SHORT: "TEXT_TOO_SHORT",

  // Resource errors (404)
  NOT_FOUND: "NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  DAILY_LIMIT_REACHED: "DAILY_LIMIT_REACHED",

  // Payment errors (402)
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  SUBSCRIPTION_EXPIRED: "SUBSCRIPTION_EXPIRED",

  // Server errors (500)
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
} as const;

/**
 * Common error responses
 */
export const CommonErrors = {
  unauthorized: () =>
    errorResponse("Unauthorized. Please login.", 401, ErrorCodes.UNAUTHORIZED),

  invalidToken: () =>
    errorResponse("Invalid or expired token.", 401, ErrorCodes.INVALID_TOKEN),

  forbidden: () =>
    errorResponse(
      "You don't have permission to access this resource.",
      403,
      ErrorCodes.FORBIDDEN,
    ),

  adminOnly: () =>
    errorResponse(
      "This endpoint is only accessible to administrators.",
      403,
      ErrorCodes.ADMIN_ONLY,
    ),

  notFound: (resource: string = "Resource") =>
    errorResponse(`${resource} not found.`, 404, ErrorCodes.NOT_FOUND),

  invalidInput: (details?: any) =>
    errorResponse(
      "Invalid input provided.",
      400,
      ErrorCodes.INVALID_INPUT,
      details,
    ),

  missingField: (field: string) =>
    errorResponse(
      `Missing required field: ${field}`,
      400,
      ErrorCodes.MISSING_REQUIRED_FIELD,
      { field },
    ),

  textTooLong: (maxWords: number) =>
    errorResponse(
      `Text exceeds maximum length of ${maxWords} words.`,
      400,
      ErrorCodes.TEXT_TOO_LONG,
      { maxWords },
    ),

  textTooShort: (minWords: number) =>
    errorResponse(
      `Text must be at least ${minWords} words.`,
      400,
      ErrorCodes.TEXT_TOO_SHORT,
      { minWords },
    ),

  rateLimitExceeded: () =>
    errorResponse(
      "Rate limit exceeded. Please try again later.",
      429,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
    ),

  quotaExceeded: () =>
    errorResponse(
      "You've reached your usage quota. Please upgrade your plan.",
      429,
      ErrorCodes.QUOTA_EXCEEDED,
    ),

  paymentRequired: () =>
    errorResponse(
      "Payment required. Please upgrade your plan.",
      402,
      ErrorCodes.PAYMENT_REQUIRED,
    ),

  internalError: () =>
    errorResponse(
      "An internal error occurred. Please try again later.",
      500,
      ErrorCodes.INTERNAL_ERROR,
    ),

  serviceUnavailable: () =>
    errorResponse(
      "Service temporarily unavailable. Please try again later.",
      503,
      ErrorCodes.SERVICE_UNAVAILABLE,
    ),
};
