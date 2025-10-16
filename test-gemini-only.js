import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Test script to check Gemini API connectivity
async function testGemini() {
  console.log('🔍 Testing Gemini API connection...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No Gemini API key found in environment variables');
    return;
  }
  
  console.log(`🔑 API Key format: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}`);
  console.log(`📏 API Key length: ${apiKey.length} characters`);
  
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log('📡 Making test API call...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro-latest",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 40,
        // Remove maxOutputTokens to see if it helps
      }
    });
    
    const result = await model.generateContent("Say hello in exactly 5 words.");
    
    console.log('Raw result:', JSON.stringify(result.response, null, 2));
    
    const response = result.response.text();
    
    console.log('✅ Gemini API test successful!');
    console.log('📝 Response:', `"${response}"`);
    console.log('📝 Response length:', response.length);
    console.log('🆓 Cost: $0.00 (Free tier)');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error('Message:', error.message);
    console.error('Details:', error.details || 'No additional details');
    
    // Specific error handling
    if (error.message?.includes('API_KEY_INVALID')) {
      console.log('🔧 Fix: Check your API key validity at https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      console.log('🔧 Fix: You have exceeded your quota');
    } else if (error.message?.includes('MODEL_NOT_FOUND')) {
      console.log('🔧 Fix: Try a different model name like "gemini-pro"');
    }
  }
}

// Run the test
testGemini().catch(console.error);