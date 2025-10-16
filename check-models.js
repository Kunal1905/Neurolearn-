import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkAvailableModels() {
  console.log('🔍 Checking available Gemini models...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Try different model names
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'gemini-pro-latest'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Hello, respond with just "Working!"');
        const response = result.response.text();
        
        console.log(`✅ ${modelName}: ${response.trim()}`);
        return modelName; // Return first working model
        
      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message.split(':')[0]}`);
      }
    }
    
  } catch (error) {
    console.error('Error testing models:', error.message);
  }
  
  return null;
}

checkAvailableModels().then(workingModel => {
  if (workingModel) {
    console.log(`\n🎉 Working model found: ${workingModel}`);
    console.log('I will update the chat API to use this model.');
  } else {
    console.log('\n❌ No working models found. Check API key permissions.');
  }
}).catch(console.error);