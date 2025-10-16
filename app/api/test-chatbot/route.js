import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// Comprehensive test scenarios for brain dominance validation
const testScenarios = {
  left: [
    {
      id: "left-math-1",
      input: "How can I solve quadratic equations more effectively?",
      expectedElements: ["step-by-step", "systematic", "logical", "formula", "structured", "methodical"],
      category: "math",
      description: "Tests analytical approach to mathematical problem-solving"
    },
    {
      id: "left-science-1", 
      input: "Explain the scientific method for conducting experiments",
      expectedElements: ["hypothesis", "data", "analysis", "systematic", "organized", "procedure"],
      category: "science",
      description: "Tests structured approach to scientific methodology"
    },
    {
      id: "left-general-1",
      input: "What's the best way to study for exams?",
      expectedElements: ["schedule", "organized", "systematic", "structured", "plan", "methodical"],
      category: "general",
      description: "Tests logical approach to study planning"
    }
  ],
  right: [
    {
      id: "right-math-1",
      input: "Help me understand calculus concepts better",
      expectedElements: ["visualize", "imagine", "creative", "story", "picture", "metaphor"],
      category: "math",
      description: "Tests creative approach to mathematical concepts"
    },
    {
      id: "right-language-1",
      input: "How can I improve my creative writing skills?",
      expectedElements: ["imagination", "creative", "storytelling", "emotional", "expressive", "artistic"],
      category: "language", 
      description: "Tests intuitive approach to language learning"
    },
    {
      id: "right-general-1",
      input: "What learning techniques work best for me?",
      expectedElements: ["visual", "creative", "holistic", "intuitive", "experiential", "imaginative"],
      category: "general",
      description: "Tests holistic approach to learning strategies"
    }
  ],
  balanced: [
    {
      id: "balanced-tech-1",
      input: "How should I approach learning programming?",
      expectedElements: ["balanced", "both", "combine", "versatile", "comprehensive", "adaptive"],
      category: "technology",
      description: "Tests balanced approach to technical learning"
    },
    {
      id: "balanced-general-1",
      input: "What's the most effective learning strategy?",
      expectedElements: ["balanced", "mix", "combination", "well-rounded", "comprehensive", "flexible"],
      category: "general",
      description: "Tests balanced approach to general learning"
    }
  ]
};

// Function to analyze chatbot response against expected elements
function analyzeResponse(response, expectedElements, brainType) {
  const responseText = response.toLowerCase();
  
  // Count matches for expected elements
  const matchedElements = expectedElements.filter(element => 
    responseText.includes(element.toLowerCase())
  );
  
  // Calculate content score (how many expected elements are present)
  const contentScore = (matchedElements.length / expectedElements.length) * 100;
  
  // Additional brain dominance indicators
  const brainIndicators = {
    left: ["step", "method", "system", "logic", "analy", "struct", "order", "sequence", "detail", "fact"],
    right: ["creat", "visual", "imag", "story", "feel", "intuit", "holist", "art", "metaphor", "color"],
    balanced: ["balance", "combin", "both", "mix", "adapt", "versatil", "comprehens", "flexible", "various"]
  };
  
  const indicators = brainIndicators[brainType] || [];
  const indicatorMatches = indicators.filter(indicator =>
    responseText.includes(indicator)
  );
  
  // Calculate alignment score (how well it matches brain type)
  const alignmentScore = Math.min(100, (indicatorMatches.length / indicators.length) * 100 + 
    (matchedElements.length > 0 ? 25 : 0));
  
  // Overall score (weighted: 60% content, 40% alignment)
  const overallScore = (contentScore * 0.6) + (alignmentScore * 0.4);
  
  return {
    contentScore: Math.round(contentScore),
    alignmentScore: Math.round(alignmentScore), 
    overallScore: Math.round(overallScore),
    matchedElements,
    indicatorMatches,
    passed: overallScore >= 60
  };
}

// Function to simulate chatbot interaction for testing
async function testChatbotResponse(testCase, brainType) {
  try {
    // Make a call to the actual chat API
    const chatResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: testCase.input,
        testMode: true // Flag to indicate this is a test
      })
    });
    
    if (!chatResponse.ok) {
      throw new Error(`Chat API returned ${chatResponse.status}`);
    }
    
    const chatData = await chatResponse.json();
    
    // Analyze the response
    const analysis = analyzeResponse(chatData.reply, testCase.expectedElements, brainType);
    
    return {
      testCase: testCase.id,
      category: testCase.category,
      description: testCase.description,
      input: testCase.input,
      response: chatData.reply,
      brainDominance: chatData.brainDominance,
      analysis,
      metadata: chatData.responseMetadata || {},
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      testCase: testCase.id,
      category: testCase.category,
      description: testCase.description,
      input: testCase.input,
      error: error.message,
      analysis: {
        contentScore: 0,
        alignmentScore: 0,
        overallScore: 0,
        matchedElements: [],
        indicatorMatches: [],
        passed: false
      },
      timestamp: new Date().toISOString()
    };
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const brainType = searchParams.get('brainType');
    const runTests = searchParams.get('run') === 'true';
    const verbose = searchParams.get('verbose') === 'true';
    
    // Get current user for authentication
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // If not running tests, return test information
    if (!runTests) {
      return NextResponse.json({
        success: true,
        availableTests: ["left", "right", "balanced"],
        totalScenarios: Object.values(testScenarios).flat().length,
        testScenarios: verbose ? testScenarios : Object.keys(testScenarios).reduce((acc, key) => {
          acc[key] = testScenarios[key].map(test => ({
            id: test.id,
            category: test.category,
            description: test.description
          }));
          return acc;
        }, {}),
        expectedBehavior: {
          left: "Responses should be logical, structured, step-by-step, and analytical with systematic approaches",
          right: "Responses should be creative, visual, imaginative, and holistic with intuitive insights",
          balanced: "Responses should combine both logical and creative approaches with versatile strategies"
        },
        usage: {
          listTests: "GET /api/test-chatbot",
          runAllTests: "GET /api/test-chatbot?run=true",
          runSpecificType: "GET /api/test-chatbot?run=true&brainType=left",
          verboseOutput: "GET /api/test-chatbot?run=true&verbose=true"
        }
      });
    }
    
    // Run the tests
    const startTime = Date.now();
    const testsToRun = brainType && testScenarios[brainType] 
      ? { [brainType]: testScenarios[brainType] }
      : testScenarios;
    
    const results = {};
    let totalTests = 0;
    let passedTests = 0;
    
    console.log(`🧪 Starting chatbot tests for: ${brainType || 'all brain types'}`);
    
    for (const [type, scenarios] of Object.entries(testsToRun)) {
      console.log(`📝 Testing ${type}-brain scenarios...`);
      results[type] = [];
      
      for (const scenario of scenarios) {
        console.log(`   Testing: ${scenario.id}`);
        const result = await testChatbotResponse(scenario, type);
        results[type].push(result);
        
        totalTests++;
        if (result.analysis.passed) {
          passedTests++;
        }
        
        // Small delay between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Calculate overall statistics
    const overallStats = {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      passRate: Math.round((passedTests / totalTests) * 100),
      duration: `${Math.round(duration / 1000)}s`,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Testing completed: ${passedTests}/${totalTests} passed (${overallStats.passRate}%)`);
    
    return NextResponse.json({
      success: true,
      stats: overallStats,
      results,
      summary: {
        recommendation: overallStats.passRate >= 80 ? 
          "🎉 Excellent! Chatbot is performing well across all brain dominance types." :
          overallStats.passRate >= 60 ?
          "⚠️ Good performance but some improvements needed for optimal brain dominance alignment." :
          "❌ Significant improvements needed for proper brain dominance adaptation.",
        keyFindings: generateKeyFindings(results),
      },
      verbose
    });
    
  } catch (error) {
    console.error("❌ Test API Error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

function generateKeyFindings(results) {
  const findings = [];
  
  // Analyze results for patterns
  Object.entries(results).forEach(([brainType, tests]) => {
    const passedCount = tests.filter(test => test.analysis.passed).length;
    const totalCount = tests.length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    if (passRate >= 80) {
      findings.push(`✅ ${brainType}-brain adaptation: Excellent (${passRate}%)`);
    } else if (passRate >= 60) {
      findings.push(`⚠️ ${brainType}-brain adaptation: Good but needs improvement (${passRate}%)`);
    } else {
      findings.push(`❌ ${brainType}-brain adaptation: Needs significant improvement (${passRate}%)`);
    }
    
    // Find common issues
    const failedTests = tests.filter(test => !test.analysis.passed);
    if (failedTests.length > 0) {
      const commonCategories = failedTests.map(test => test.category);
      const mostProblematic = commonCategories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});
      
      const topIssue = Object.entries(mostProblematic).sort((a, b) => b[1] - a[1])[0];
      if (topIssue) {
        findings.push(`🔍 ${brainType}-brain: Most issues in ${topIssue[0]} category`);
      }
    }
  });
  
  return findings;
}

export async function POST(req) {
  try {
    const { testCase, brainType } = await req.json();
    
    // Get current user for authentication
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (!testCase || !brainType) {
      return NextResponse.json({
        error: "testCase and brainType are required"
      }, { status: 400 });
    }
    
    // Find the test case
    const scenario = testScenarios[brainType]?.find(test => test.id === testCase);
    if (!scenario) {
      return NextResponse.json({
        error: `Test case '${testCase}' not found for brain type '${brainType}'`
      }, { status: 404 });
    }
    
    // Run single test
    const result = await testChatbotResponse(scenario, brainType);
    
    return NextResponse.json({
      success: true,
      result,
      recommendation: result.analysis.passed ?
        "✅ Test passed! Chatbot response aligns well with brain dominance expectations." :
        "❌ Test failed. Consider reviewing chatbot logic for better brain dominance adaptation."
    });
    
  } catch (error) {
    console.error("❌ Test POST Error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}