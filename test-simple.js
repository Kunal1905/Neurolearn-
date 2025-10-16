async function testChatAPI() {
  console.log('🧪 Testing Enhanced Chat API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'GET'
    });
    
    if (response.status === 401) {
      console.log('✅ Server is running and API is accessible');
      console.log('📋 Note: 401 is expected (authentication required)');
    } else {
      console.log(`Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Server not accessible:', error.message);
    console.log('💡 Make sure to run: npm run dev');
  }
}

testChatAPI();