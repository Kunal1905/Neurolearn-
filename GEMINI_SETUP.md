# 🚀 Google Gemini API Setup Guide (100% Free!)

## ✅ Why Google Gemini?

- **Completely Free**: No payment method required
- **Generous Limits**: 15 requests/minute, 1,500 requests/day  
- **High Quality**: Gemini 1.5 Flash is very capable
- **Easy Setup**: Just 3 steps to get started
- **Brain Dominance Compatible**: Works perfectly with your system

## 📋 Setup Steps

### Step 1: Get Your Free Gemini API Key

1. **Visit**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the generated key**

### Step 2: Add API Key to Your Project

1. **Open** your `.env.local` file
2. **Replace** `your_gemini_api_key_here` with your actual key:
   ```
   GEMINI_API_KEY=AIzaSyC_your_actual_gemini_api_key_here
   ```
3. **Save** the file

### Step 3: Test Your Setup

Run this command to test your Gemini API:
```bash
node test-gemini.js
```

## 🔄 Switch Your Chatbot to Gemini

### Option A: Replace OpenAI Completely
Update your chat component to use the new endpoint:
```javascript
// In your chat component, change:
const response = await fetch('/api/chat', {
// To:
const response = await fetch('/api/chat-gemini', {
```

### Option B: Keep Both (Recommended)
Keep OpenAI as backup and use Gemini as primary. I can help you set this up.

## 🎯 Benefits You'll Get

✅ **No More Quota Errors**: Free tier with 1,500 requests/day
✅ **No Payment Method**: Completely free to use
✅ **Same Brain Dominance**: All your existing logic works
✅ **Better Performance**: Often faster than OpenAI
✅ **Higher Quality**: Gemini 1.5 Flash is excellent for education

## 🧪 Test Commands

```bash
# Test Gemini API directly
node test-gemini.js

# Test your enhanced chatbot
curl -X POST http://localhost:3000/api/chat-gemini \
  -H "Content-Type: application/json" \
  -d '{"message": "Help me learn math creatively"}'
```

## 🛟 Troubleshooting

**"API key not configured"**: Make sure you've added your real API key to `.env.local`

**"403 Forbidden"**: Your API key might be incorrect, generate a new one

**"429 Rate Limited"**: You've hit the free tier limits (very generous though!)

## 🎉 Ready to Switch?

Once you have your Gemini API key:
1. Add it to `.env.local`
2. Test with `node test-gemini.js`
3. Update your chat component to use `/api/chat-gemini`
4. Enjoy unlimited free AI responses!

Your brain dominance system will work exactly the same, but now completely free! 🎊