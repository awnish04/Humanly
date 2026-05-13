# API Restructuring Plan - ZeroGPT Style

## Overview

Restructure the Humanly API to follow ZeroGPT's organized architecture with clear separation of concerns.

## Current Structure Issues

- ❌ Flat structure with mixed concerns
- ❌ Inconsistent naming (`/detect` vs `/humanize` vs `/track-visitor`)
- ❌ No clear API versioning
- ❌ Mixed admin and user endpoints

## New Structure (ZeroGPT-inspired)

### 1. Authentication & Authorization (`/api/auth/*`)

**Purpose:** Handle all authentication, registration, and API key management

```
/api/auth/
├── /login              POST   - User login (returns JWT)
├── /register           POST   - User registration
├── /generate-api-key   GET    - Generate API key for integrations
├── /forgot-password    POST   - Request password reset
├── /reset-password     POST   - Confirm password reset
├── /verify-email       POST   - Verify email address
└── /admin-login        POST   - Admin authentication (separate)
```

**Response Format (all endpoints):**

```json
{
  "success": boolean,
  "code": number,
  "data": object,
  "message": string
}
```

---

### 2. Detection Services (`/api/detect/*`)

**Purpose:** AI content detection

```
/api/detect/
├── /text               POST   - Detect AI in text
├── /file               POST   - Detect AI in uploaded file
├── /batch              POST   - Batch detection (multiple texts)
└── /result/:id         GET    - Get detection result by ID
```

**Example Request (`/api/detect/text`):**

```json
{
  "text": "Your text here...",
  "options": {
    "detailed": true,
    "sentenceLevel": true
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": "det_abc123",
    "aiPercentage": 75,
    "humanPercentage": 25,
    "assistedPercentage": 0,
    "aiWords": 150,
    "totalWords": 200,
    "sentences": [
      {
        "text": "This is a sentence.",
        "aiProbability": 0.85,
        "isAI": true
      }
    ],
    "detectors": {
      "turnitin": 78,
      "gptzero": 72,
      "originality": 75
    }
  },
  "message": "Detection completed successfully"
}
```

---

### 3. Humanization Services (`/api/humanize/*`)

**Purpose:** Convert AI text to human-like text

```
/api/humanize/
├── /text               POST   - Humanize text
├── /file               POST   - Humanize uploaded file
├── /batch              POST   - Batch humanization
└── /result/:id         GET    - Get humanization result by ID
```

**Example Request (`/api/humanize/text`):**

```json
{
  "text": "Your AI-generated text here...",
  "options": {
    "mode": "balanced", // "creative" | "balanced" | "formal"
    "variants": 3, // Number of output variants
    "preserveFormatting": true
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": "hum_xyz789",
    "results": [
      {
        "text": "Humanized version 1...",
        "aiScore": 15,
        "wordCount": 200
      },
      {
        "text": "Humanized version 2...",
        "aiScore": 12,
        "wordCount": 198
      }
    ],
    "originalWordCount": 200,
    "processingTime": 2.5
  },
  "message": "Humanization completed successfully"
}
```

---

### 4. User Dashboard (`/api/dashboard/*`)

**Purpose:** User account management and statistics

**🔒 All endpoints require JWT authentication**

```
/api/dashboard/
├── /stats              GET    - User usage statistics
├── /history            GET    - Detection/humanization history
├── /billing            GET    - Billing information
├── /usage              GET    - Current usage & limits
├── /api-keys           GET    - List API keys
├── /api-keys           POST   - Create new API key
├── /api-keys/:id       DELETE - Revoke API key
├── /settings           GET    - Get user settings
├── /settings           PUT    - Update user settings
├── /change-password    POST   - Change password
└── /export             GET    - Export user data
```

**Example Response (`/api/dashboard/stats`):**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "plan": "Pro",
    "wordsUsed": 15000,
    "wordsLimit": 30000,
    "detectionsUsed": 250,
    "detectionsLimit": 1000,
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "usage": {
      "humanize": 12000,
      "detect": 3000
    }
  },
  "message": "Stats retrieved successfully"
}
```

---

### 5. Admin Panel (`/api/admin/*`)

**Purpose:** Admin-only endpoints for site management

**🔒 All endpoints require admin authentication**

```
/api/admin/
├── /users              GET    - List all users
├── /users/:id          GET    - Get user details
├── /users/:id          PUT    - Update user
├── /users/:id          DELETE - Delete user
├── /analytics          GET    - Site analytics
├── /revenue            GET    - Revenue statistics
├── /settings           GET    - Admin settings
├── /settings           PUT    - Update admin settings
└── /logs               GET    - System logs
```

---

### 6. Analytics & Tracking (`/api/analytics/*`)

**Purpose:** Visitor tracking and site analytics

```
/api/analytics/
├── /track-visitor      POST   - Track page visit
├── /track-click        POST   - Track click event
├── /track-time         POST   - Track time spent
├── /visitor-stats      GET    - Get visitor statistics
└── /click-stats        GET    - Get click statistics
```

---

### 7. Billing & Payments (`/api/billing/*`)

**Purpose:** Payment processing and subscription management

```
/api/billing/
├── /checkout           POST   - Create checkout session
├── /subscription       GET    - Get subscription details
├── /subscription       PUT    - Update subscription
├── /subscription       DELETE - Cancel subscription
├── /invoices           GET    - List invoices
├── /payment-methods    GET    - List payment methods
└── /webhooks/stripe    POST   - Stripe webhook handler
```

---

## Standard Response Format

All API endpoints follow this format:

```typescript
interface ApiResponse<T = any> {
  success: boolean; // true if request succeeded
  code: number; // HTTP status code
  data: T; // Response data (type varies by endpoint)
  message: string; // Human-readable message
  error?: {
    // Optional error details
    code: string;
    details: any;
  };
}
```

---

## Authentication

### JWT Token Authentication

**For user endpoints:**

```
Authorization: Bearer <jwt_token>
```

**For API key authentication:**

```
X-API-Key: <api_key>
```

**For admin endpoints:**

```
Authorization: Bearer <admin_jwt_token>
```

---

## Error Handling

All errors follow the same format:

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "message": "Invalid request",
  "error": {
    "code": "INVALID_INPUT",
    "details": {
      "field": "text",
      "reason": "Text is required"
    }
  }
}
```

**Common Error Codes:**

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

**Free Tier:**

- 10 requests per minute
- 100 requests per day

**Basic Plan:**

- 60 requests per minute
- 1,000 requests per day

**Pro Plan:**

- 120 requests per minute
- 5,000 requests per day

**Max Plan:**

- Unlimited requests

---

## Migration Steps

### Phase 1: Create New Structure (Week 1)

1. ✅ Create new API folders
2. ✅ Implement standardized response format
3. ✅ Add JWT authentication middleware
4. ✅ Create API key generation system

### Phase 2: Migrate Existing Endpoints (Week 2)

1. Move `/detect` → `/api/detect/text`
2. Move `/humanize` → `/api/humanize/text`
3. Move `/usage` → `/api/dashboard/usage`
4. Move `/billing` → `/api/billing/subscription`

### Phase 3: Update Frontend (Week 3)

1. Update all API calls to new endpoints
2. Add JWT token handling
3. Update error handling
4. Test all features

### Phase 4: Deprecate Old Endpoints (Week 4)

1. Add deprecation warnings to old endpoints
2. Monitor usage
3. Remove old endpoints after 30 days

---

## Implementation Priority

### High Priority (Implement First)

1. ✅ `/api/detect/text` - Core detection
2. ✅ `/api/humanize/text` - Core humanization
3. ✅ `/api/auth/login` - User authentication
4. ✅ `/api/dashboard/stats` - User dashboard

### Medium Priority

5. `/api/detect/file` - File upload detection
6. `/api/humanize/batch` - Batch processing
7. `/api/dashboard/history` - Usage history
8. `/api/billing/checkout` - Payment processing

### Low Priority

9. `/api/detect/batch` - Batch detection
10. `/api/admin/*` - Admin panel APIs
11. `/api/analytics/*` - Analytics tracking

---

## Benefits of New Structure

✅ **Clear Organization** - Logical grouping by functionality
✅ **Scalability** - Easy to add new endpoints
✅ **Consistency** - Standardized response format
✅ **Security** - Proper authentication separation
✅ **Documentation** - Self-documenting structure
✅ **Versioning** - Easy to add `/v2` in future

---

## Next Steps

1. Review this plan with your manager
2. Get approval for the structure
3. Start with Phase 1 implementation
4. Create API documentation (Swagger/OpenAPI)
5. Update frontend to use new endpoints
