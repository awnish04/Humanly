# Test Your New API Setup

## ✅ Your Sapling API Key is Configured!

Your `.env.local` now has:

```env
SAPLING_API_KEY="UIT8QQRNZAPI5WBJLDK7OUGFH2OKC7ML"
SAPLING_PUBLIC_KEY="Cs_V6yFzy3dQwYqiFoIUBfigCe9-6Yr7763jP_8WV_JAUSCEqx--oqrxp-_UDDR65VHa6awckLwDRlwCQrB2kQ%3D%3D"
```

## 🚀 Test the Detection API Now

### Step 1: Start Your Server

```bash
pnpm dev
```

### Step 2: Test with Sapling API

**Test 1: Detect AI-generated text**

```bash
curl -X POST http://localhost:3000/api/detect/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence has revolutionized numerous industries in recent years. It is important to note that machine learning algorithms have become increasingly sophisticated. Furthermore, the implementation of AI systems has led to significant improvements in efficiency and productivity.",
    "options": {
      "detailed": true,
      "sentenceLevel": true
    }
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": "det_1234567890_abc123",
    "aiPercentage": 85,
    "humanPercentage": 15,
    "assistedPercentage": 0,
    "aiWords": 42,
    "totalWords": 49,
    "sentences": [
      {
        "text": "Artificial intelligence has revolutionized numerous industries in recent years",
        "aiProbability": 0.82,
        "isAI": true
      },
      {
        "text": "It is important to note that machine learning algorithms have become increasingly sophisticated",
        "aiProbability": 0.95,
        "isAI": true
      },
      {
        "text": "Furthermore, the implementation of AI systems has led to significant improvements in efficiency and productivity",
        "aiProbability": 0.88,
        "isAI": true
      }
    ],
    "detectors": {
      "sapling": 85
    },
    "processingTime": 1.2
  },
  "message": "Detection completed successfully"
}
```

**Test 2: Detect human-written text**

```bash
curl -X POST http://localhost:3000/api/detect/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hey! So I was thinking about grabbing coffee later. You free around 3? I know this cool spot downtown that just opened. Their lattes are amazing, and they have these crazy good pastries too. Let me know!",
    "options": {
      "detailed": true
    }
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": "det_1234567890_xyz789",
    "aiPercentage": 15,
    "humanPercentage": 75,
    "assistedPercentage": 10,
    "aiWords": 6,
    "totalWords": 40,
    "detectors": {
      "sapling": 15
    },
    "processingTime": 0.8
  },
  "message": "Detection completed successfully"
}
```

**Test 3: Error handling (empty text)**

```bash
curl -X POST http://localhost:3000/api/detect/text \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'
```

**Expected Response:**

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "message": "Text cannot be empty",
  "error": {
    "code": "INVALID_INPUT"
  }
}
```

**Test 4: Error handling (text too short)**

```bash
curl -X POST http://localhost:3000/api/detect/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Too short"}'
```

**Expected Response:**

```json
{
  "success": false,
  "code": 400,
  "data": null,
  "message": "Text must be at least 10 words.",
  "error": {
    "code": "TEXT_TOO_SHORT",
    "details": {
      "minWords": 10
    }
  }
}
```

---

## 🎯 What's Happening Behind the Scenes

When you call `/api/detect/text`, it:

1. **Validates input** - Checks text length, format
2. **Tries Sapling API** - Uses your API key (now configured!)
3. **Falls back to local** - If Sapling fails, uses heuristic
4. **Analyzes sentences** - If `detailed: true` is set
5. **Returns standardized response** - ZeroGPT-style format

---

## 🔄 Compare Old vs New Endpoint

### Old Endpoint: `/api/detect`

```bash
curl -X POST http://localhost:3000/api/detect \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'
```

**Response:**

```json
{
  "ai": 85,
  "assisted": 10,
  "human": 5
}
```

### New Endpoint: `/api/detect/text` ✨

```bash
curl -X POST http://localhost:3000/api/detect/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'
```

**Response:**

```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": "det_123",
    "aiPercentage": 85,
    "humanPercentage": 5,
    "assistedPercentage": 10,
    "aiWords": 17,
    "totalWords": 20,
    "detectors": { "sapling": 85 },
    "processingTime": 1.2
  },
  "message": "Detection completed successfully"
}
```

**Benefits:**

- ✅ Unique detection ID
- ✅ Word counts
- ✅ Which detector was used
- ✅ Processing time
- ✅ Standardized format
- ✅ Better error handling

---

## 🎨 Test in Your Frontend

The "Check for AI" button in your humanizer card will work with both endpoints!

**Current code works with old endpoint:**

```typescript
const res = await fetch("/api/detect", {
  method: "POST",
  body: JSON.stringify({ text: textToCheck }),
});
const data = await res.json();
// data = { ai: 85, assisted: 10, human: 5 }
```

**To use new endpoint (optional upgrade):**

```typescript
const res = await fetch("/api/detect/text", {
  method: "POST",
  body: JSON.stringify({
    text: textToCheck,
    options: { detailed: true },
  }),
});
const response = await res.json();
if (response.success) {
  const { aiPercentage, humanPercentage, assistedPercentage } = response.data;
  // Use these values
}
```

---

## 📊 Monitor API Usage

### Check Sapling Dashboard

Visit: https://sapling.ai/dashboard

You can see:

- API calls made
- Remaining quota
- Usage statistics

### Check Your Logs

In your terminal where `pnpm dev` is running, you'll see:

```
Detection completed successfully
Processing time: 1.2s
Detector used: sapling
```

---

## 🐛 Troubleshooting

### Issue: "Sapling API failed, using local estimate"

**Possible causes:**

1. API key is invalid
2. API quota exceeded
3. Network issue

**Solution:**

- Check your Sapling dashboard for quota
- Verify API key is correct in `.env.local`
- The local fallback will still work!

### Issue: "Cannot find module '@/lib/api-response'"

**Solution:**

```bash
# Restart your dev server
# Press Ctrl+C to stop
pnpm dev
```

### Issue: Response shows `"detectors": {"local": 85}`

**This means:**

- Sapling API didn't respond
- Local heuristic was used instead
- Still works, but less accurate

**To fix:**

- Check Sapling API key
- Check internet connection
- Check Sapling service status

---

## ✅ Success Checklist

- [ ] Sapling API key added to `.env.local`
- [ ] Dev server running (`pnpm dev`)
- [ ] Tested with curl command
- [ ] Got successful response with `"detectors": {"sapling": ...}`
- [ ] Tested "Check for AI" button in frontend
- [ ] Verified AI scores display correctly

---

## 🎉 You're All Set!

Your API is now:

- ✅ Using Sapling AI detection (more accurate!)
- ✅ Following ZeroGPT structure
- ✅ Returning standardized responses
- ✅ Ready for ZeroGPT integration (when you get credentials)

**Next steps:**

1. Test the curl commands above
2. Try the "Check for AI" button in your app
3. Show your manager the results!
