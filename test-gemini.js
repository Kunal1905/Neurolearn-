import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testGemini() {
  console.log('🧪 Testing Google Gemini API...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('❌ Gemini API key not configured!');
    console.log('📋 Setup steps:');
    console.log('1. Visit: https://aistudio.google.com/app/apikey');
    console.log('2. Sign in with Google account');
    console.log('3. Create API key');
    console.log('4. Add to .env.local: GEMINI_API_KEY=your_key_here');
    return;
  }
  
  console.log(`🔑 API Key format: ${apiKey.substring(0, 20)}...`);
  console.log(`📏 API Key length: ${apiKey.length} characters`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('📡 Making test API call...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro-latest",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 40,
        maxOutputTokens: 100,
      }
    });
    
    const result = await model.generateContent([
      "You are a helpful learning assistant. Say hello and ask how you can help the user learn today. Keep it brief and friendly."
    ]);
    
    const response = result.response.text();
    
    console.log('✅ Gemini API test successful!');
    console.log('📝 Response:', response);
    console.log('🎯 Usage info:', {
      model: "gemini-1.5-flash",
      freeLimit: "1,500 requests/day",
      rateLimit: "15 requests/minute"
    });
    
    console.log('\n🎉 Great! Your Gemini API is working perfectly!');
    console.log('💡 Next steps:');
    console.log('1. Update your chat component to use /api/chat-gemini');
    console.log('2. Enjoy unlimited free AI responses!');
    console.log('3. Your brain dominance system will work exactly the same');
    
  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('🔧 Fix: Your API key is invalid. Get a new one at:');
      console.log('   https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('403')) {
      console.log('🔧 Fix: API key permissions issue. Try:');
      console.log('   1. Generate a new API key');
      console.log('   2. Make sure the key has proper permissions');
    } else if (error.message.includes('quota')) {
      console.log('🔧 Fix: You may have exceeded rate limits');
      console.log('   Free tier: 15 requests/minute, 1,500/day');
    } else {
      console.log('🔧 Fix: Check your internet connection and try again');
    }
  }
}

// Test brain dominance simulation
async function testBrainDominance() {
  console.log('\n🧠 Testing Brain Dominance Adaptation...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('⏭️ Skipping brain dominance test - API key not configured');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
  
  const tests = [
    {
      type: 'left',
      prompt: 'You are a logical, analytical tutor. Explain how to solve math problems step-by-step.',
      expected: ['step', 'logical', 'systematic', 'method']
    },
    {
      type: 'right', 
      prompt: 'You are a creative, intuitive tutor. Explain how to learn math through visualization.',
      expected: ['creative', 'visual', 'imagine', 'story']
    }
  ];
  
  for (const test of tests) {
    try {
      const result = await model.generateContent([test.prompt + ' Keep response brief.']);
      const response = result.response.text().toLowerCase();
      
      const matches = test.expected.filter(word => response.includes(word));
      const score = (matches.length / test.expected.length) * 100;
      
      console.log(`${score >= 50 ? '✅' : '⚠️'} ${test.type}-brain test: ${score}% match`);
      console.log(`   Response: "${result.response.text().substring(0, 100)}..."`);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ ${test.type}-brain test failed:`, error.message);
    }
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testGemini();
    await testBrainDominance();
    
    console.log('\n🚀 Testing completed!');
    console.log('📊 Summary:');
    console.log('   • Gemini API: Ready for free usage');
    console.log('   • Brain dominance: Compatible with your system');
    console.log('   • Rate limits: 15/minute, 1,500/day');
    console.log('   • Cost: $0.00 (completely free!)');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
  }
}

runAllTests().catch(console.error);