import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function findWorkingModel() {
  console.log('🔍 Finding working Gemini model...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Test different model names based on Google's latest documentation
  const modelNames = [
    'gemini-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest', 
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash'
  ];
  
  for (const modelName of modelNames) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent('Hello');
      const response = result.response.text();
      
      console.log(`✅ ${modelName} works! Response: "${response.substring(0, 50)}..."`);
      return modelName;
      
    } catch (error) {
      console.log(`❌ ${modelName}: ${error.message.split(':')[0]}`);
    }
  }
  
  console.log('❌ No working models found');
  return null;
}

findWorkingModel().then(workingModel => {
  if (workingModel) {
    console.log(`\n🎉 Use this model in your chat API: ${workingModel}`);
  } else {
    console.log('\n💡 Try these solutions:');
    console.log('1. Check if your API key has proper permissions');
    console.log('2. Verify your Google Cloud project is set up correctly');
    console.log('3. Check if Generative AI API is enabled');
    console.log('4. Try generating a new API key');
  }
}).catch(console.error);