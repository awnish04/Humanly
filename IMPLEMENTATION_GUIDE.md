# API Implementation Guide - ZeroGPT Style

## ✅ What's Been Done

### 1. Created Standardized Response Format

**File:** `src/lib/api-response.ts`

All API responses now follow this format:

```typescript
{
  success: boolean,
  code: number,
  data: object | null,
  message: string,
  error?: {
    code: string,
    details: any
  }
}
```

**Helper Functions:**

- `successResponse()` - Create success responses
- `errorResponse()` - Create error responses
- `CommonErrors` - Pre-built common error responses

### 2. Created New Detection Endpoint

**File:** `src/app/api/detect/text/route.ts`

**Endpoint:** `POST /api/detect/text`

**Features:**

- ✅ Standardized response format
- ✅ Multi-provider detection (ZeroGPT → Sapling → Local)
- ✅ Sentence-level analysis
- ✅ Word count validation
- ✅ Detailed error messages
- ✅ Processing time tracking

**Request:**

```json
{
  "text": "Your text here...",
  "options": {
    "detailed": true,
    "sentenceLevel": true
  }
}
```

**Response:**

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
    "sentences": [...],
    "detectors": {
      "zerogpt": 75,
      "sapling": 72
    },
    "processingTime": 1.5
  },
  "message": "Detection completed successfully"
}
```

### 3. Updated Environment Variables

**File:** `.env.local`

Added support for:

- ✅ ZeroGPT API credentials
- ✅ Sapling API key
- ✅ Proper separation of test/live keys
- ✅ Clear documentation

---

## 🚀 Next Steps

### Step 1: Test the New Detection Endpoint

1. **Start your development server:**

   ```bash
   pnpm dev
   ```

2. **Test with curl:**

   ```bash
   curl -X POST http://localhost:3000/api/detect/text \
     -H "Content-Type: application/json" \
     -d '{
       "text": "Artificial intelligence has revolutionized numerous industries in recent years.",
       "options": {
         "detailed": true
       }
     }'
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "code": 200,
     "data": {
       "id": "det_...",
       "aiPercentage": 85,
       "humanPercentage": 15,
       "assistedPercentage": 0,
       "aiWords": 12,
       "totalWords": 14,
       "sentences": [...]
     },
     "message": "Detection completed successfully"
   }
   ```

### Step 2: Update Frontend to Use New Endpoint

**File to update:** `src/components/home/hero/humanizer-card.tsx`

**Current code (line ~513):**

```typescript
const res = await fetch("/api/detect", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: textToCheck }),
});
```

**New code:**

```typescript
const res = await fetch("/api/detect/text", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: textToCheck,
    options: {
      detailed: true,
      sentenceLevel: true,
    },
  }),
});
```

**Update response handling (line ~520):**

```typescript
const response = await res.json();
if (!response.success) {
  toast.error(response.message ?? "Detection failed");
  return;
}

// Extract data from new format
const { aiPercentage, humanPercentage, assistedPercentage } = response.data;
setAiScores({
  ai: aiPercentage,
  human: humanPercentage,
  assisted: assistedPercentage,
});
```

### Step 3: Create Remaining Endpoints

#### A. Humanize Text Endpoint

**Create:** `src/app/api/humanize/text/route.ts`

```typescript
import { NextRequest } from "next/server";
import { successResponse, CommonErrors } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { text, options = {} } = await req.json();

    if (!text) {
      return CommonErrors.missingField("text");
    }

    // Your existing humanization logic here
    const result = await humanizeText(text, options);

    return successResponse(
      {
        id: `hum_${Date.now()}`,
        results: result.results,
        originalWordCount: countWords(text),
        processingTime: result.time,
      },
      "Humanization completed successfully",
    );
  } catch (error) {
    return CommonErrors.internalError();
  }
}
```

#### B. Dashboard Stats Endpoint

**Create:** `src/app/api/dashboard/stats/route.ts`

```typescript
import { NextRequest } from "next/server";
import { successResponse, CommonErrors } from "@/lib/api-response";
import { auth } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return CommonErrors.unauthorized();
    }

    // Fetch user stats from database
    const stats = await getUserStats(userId);

    return successResponse(
      {
        plan: stats.plan,
        wordsUsed: stats.wordsUsed,
        wordsLimit: stats.wordsLimit,
        detectionsUsed: stats.detectionsUsed,
        detectionsLimit: stats.detectionsLimit,
        periodStart: stats.periodStart,
        periodEnd: stats.periodEnd,
      },
      "Stats retrieved successfully",
    );
  } catch (error) {
    return CommonErrors.internalError();
  }
}
```

#### C. Dashboard History Endpoint

**Create:** `src/app/api/dashboard/history/route.ts`

```typescript
import { NextRequest } from "next/server";
import { successResponse, CommonErrors } from "@/lib/api-response";
import { auth } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return CommonErrors.unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // "detect" | "humanize" | "all"

    const history = await getUserHistory(userId, { page, limit, type });

    return successResponse(
      {
        items: history.items,
        total: history.total,
        page,
        limit,
        hasMore: history.hasMore,
      },
      "History retrieved successfully",
    );
  } catch (error) {
    return CommonErrors.internalError();
  }
}
```

### Step 4: Add ZeroGPT API Integration

1. **Get ZeroGPT credentials:**
   - Email: info@zerogpt.com
   - Request Business API access
   - Get API key and pricing

2. **Login to get JWT token:**

   ```bash
   curl -X POST https://api.zerogpt.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "your@email.com",
       "password": "yourpassword"
     }'
   ```

3. **Add to `.env.local`:**

   ```env
   ZEROGPT_API_KEY="your_api_key_here"
   ZEROGPT_TOKEN="your_jwt_token_here"
   ```

4. **Test ZeroGPT integration:**
   The new `/api/detect/text` endpoint already includes ZeroGPT support!
   It will automatically use ZeroGPT if credentials are available.

### Step 5: Create API Documentation

**Create:** `src/app/api-docs/page.tsx`

Create a documentation page showing:

- All available endpoints
- Request/response examples
- Authentication requirements
- Rate limits
- Error codes

You can use tools like:

- Swagger UI
- Redoc
- Custom Next.js page

---

## 📁 File Structure

```
src/
├── lib/
│   └── api-response.ts          ✅ Created - Standardized responses
│
├── app/
│   └── api/
│       ├── detect/
│       │   ├── route.ts         ✅ Updated - Deprecated warning
│       │   └── text/
│       │       └── route.ts     ✅ Created - New detection endpoint
│       │
│       ├── humanize/
│       │   ├── route.ts         ⏳ To update
│       │   └── text/
│       │       └── route.ts     ⏳ To create
│       │
│       ├── dashboard/
│       │   ├── stats/
│       │   │   └── route.ts     ⏳ To create
│       │   ├── history/
│       │   │   └── route.ts     ⏳ To create
│       │   ├── usage/
│       │   │   └── route.ts     ⏳ To create
│       │   └── billing/
│       │       └── route.ts     ⏳ To create
│       │
│       └── auth/
│           ├── login/
│           │   └── route.ts     ⏳ To create
│           └── generate-api-key/
│               └── route.ts     ⏳ To create
```

---

## 🧪 Testing Checklist

### Detection Endpoint

- [ ] Test with valid text
- [ ] Test with empty text
- [ ] Test with text too short (< 10 words)
- [ ] Test with text too long (> 5000 words)
- [ ] Test with `detailed: true` option
- [ ] Test with `sentenceLevel: true` option
- [ ] Verify response format matches spec
- [ ] Check error handling

### Frontend Integration

- [ ] Update humanizer card to use new endpoint
- [ ] Update error handling
- [ ] Test "Check for AI" button
- [ ] Verify AI scores display correctly
- [ ] Test with sample text
- [ ] Test with user input

### ZeroGPT Integration (if credentials available)

- [ ] Add credentials to `.env.local`
- [ ] Test detection with ZeroGPT
- [ ] Verify fallback to Sapling works
- [ ] Verify fallback to local works
- [ ] Check response includes detector scores

---

## 📊 Migration Timeline

### Week 1: Core Endpoints

- [x] Day 1-2: Create standardized response format
- [x] Day 3-4: Implement `/api/detect/text`
- [ ] Day 5: Update frontend to use new endpoint
- [ ] Day 6-7: Testing and bug fixes

### Week 2: Additional Endpoints

- [ ] Day 1-2: Implement `/api/humanize/text`
- [ ] Day 3-4: Implement `/api/dashboard/stats`
- [ ] Day 5: Implement `/api/dashboard/history`
- [ ] Day 6-7: Testing and integration

### Week 3: Advanced Features

- [ ] Day 1-2: Add file upload support
- [ ] Day 3-4: Add batch processing
- [ ] Day 5: Add rate limiting
- [ ] Day 6-7: Performance optimization

### Week 4: Documentation & Cleanup

- [ ] Day 1-2: Create API documentation
- [ ] Day 3-4: Add deprecation warnings to old endpoints
- [ ] Day 5: Monitor usage and fix issues
- [ ] Day 6-7: Remove old endpoints

---

## 🔧 Troubleshooting

### Issue: "Cannot find module '@/lib/api-response'"

**Solution:** Make sure the file exists at `src/lib/api-response.ts`

### Issue: New endpoint returns 404

**Solution:**

1. Check file is at correct path: `src/app/api/detect/text/route.ts`
2. Restart dev server: `pnpm dev`
3. Clear Next.js cache: `rm -rf .next`

### Issue: ZeroGPT detection not working

**Solution:**

1. Verify credentials in `.env.local`
2. Check token hasn't expired (tokens expire after 24 hours)
3. Re-login to get new token
4. Check API balance in ZeroGPT dashboard

### Issue: Frontend still using old response format

**Solution:**

1. Update frontend code to use `response.data` instead of direct response
2. Update error handling to check `response.success`
3. Clear browser cache
4. Restart dev server

---

## 📞 Support

If you need help:

1. Check this guide first
2. Review `API_RESTRUCTURE_PLAN.md`
3. Check error messages in console
4. Ask your manager for clarification

---

## ✨ Benefits of New Structure

✅ **Consistency** - All endpoints use same response format
✅ **Scalability** - Easy to add new endpoints
✅ **Error Handling** - Standardized error codes and messages
✅ **Documentation** - Self-documenting structure
✅ **Testing** - Easier to write tests
✅ **Maintenance** - Clear separation of concerns
✅ **Professional** - Matches industry standards (like ZeroGPT)
