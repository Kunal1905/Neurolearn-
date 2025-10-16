import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/config/db";
import { usersTable, chatsTable, messagesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced knowledge base for different learning topics (same as your existing system)
const knowledgeBase = {
  math: {
    left: [
      "Step-by-step problem solving: Break complex equations into smaller parts",
      "Use logical sequences: Start with basic operations, then build complexity",
      "Practice with structured worksheets and formula memorization",
      "Focus on analytical thinking and pattern recognition in numbers",
      "Apply systematic approaches like PEMDAS or algebraic methods"
    ],
    right: [
      "Visualize math concepts using charts, graphs, and geometric shapes",
      "Use storytelling to explain mathematical problems and real-world applications",
      "Create colorful mind maps connecting different mathematical concepts",
      "Learn through spatial reasoning and visual patterns",
      "Use analogies and metaphors to understand abstract concepts"
    ],
    balanced: [
      "Combine visual aids with logical step-by-step approaches",
      "Use both analytical problem-solving and creative visualization",
      "Practice with real-world examples that require both logic and creativity",
      "Alternate between structured practice and exploratory learning",
      "Connect mathematical concepts to both practical and creative applications"
    ]
  },
  science: {
    left: [
      "Focus on systematic experimentation and data collection",
      "Use scientific method: hypothesis, experiment, analyze, conclude",
      "Study with detailed diagrams and classification systems",
      "Practice with quantitative analysis and statistical reasoning",
      "Break down complex processes into sequential steps"
    ],
    right: [
      "Learn through hands-on experiments and visual demonstrations",
      "Use analogies and metaphors to understand complex concepts",
      "Create concept maps showing relationships between ideas",
      "Focus on the big picture and interconnected systems",
      "Use storytelling to remember scientific processes and discoveries"
    ],
    balanced: [
      "Combine systematic study with creative exploration",
      "Use both detailed analysis and holistic understanding",
      "Practice with collaborative experiments and independent research",
      "Connect scientific concepts to real-world applications",
      "Balance theoretical knowledge with practical experimentation"
    ]
  },
  language: {
    left: [
      "Focus on grammar rules, syntax, and structured vocabulary building",
      "Use systematic approaches to language learning with clear progression",
      "Practice with analytical reading and detailed text analysis",
      "Study language patterns and logical sentence construction",
      "Use organized lists and systematic memorization techniques"
    ],
    right: [
      "Learn through storytelling, creative writing, and imaginative exercises",
      "Use visual aids, images, and emotional connections to words",
      "Practice with music, rhythm, and artistic expression in language",
      "Focus on creative interpretation and intuitive understanding",
      "Use role-playing and dramatic expression to learn language"
    ],
    balanced: [
      "Combine structured grammar study with creative expression",
      "Use both analytical reading and creative writing exercises",
      "Practice with diverse methods: visual, auditory, and kinesthetic",
      "Balance technical accuracy with creative fluency",
      "Integrate formal study with informal conversation practice"
    ]
  },
  technology: {
    left: [
      "Learn programming through systematic step-by-step tutorials",
      "Focus on logical problem-solving and algorithmic thinking",
      "Use structured debugging approaches and error analysis",
      "Practice with well-organized code examples and documentation",
      "Apply mathematical principles to programming concepts"
    ],
    right: [
      "Learn technology through creative projects and visual interfaces",
      "Focus on user experience design and creative problem-solving",
      "Use visual programming tools and interactive learning platforms",
      "Practice with multimedia projects and creative applications",
      "Connect technology to artistic and creative endeavors"
    ],
    balanced: [
      "Combine systematic learning with creative project-based approaches",
      "Balance technical skills with user-focused design thinking",
      "Practice both analytical problem-solving and creative innovation",
      "Integrate logical programming with intuitive interface design",
      "Use both structured tutorials and exploratory learning methods"
    ]
  },
  general: {
    left: [
      "Create structured study schedules with clear goals and milestones",
      "Use logical reasoning and analytical thinking for problem-solving",
      "Focus on detail-oriented learning with systematic approaches",
      "Practice with data-driven methods and measurable outcomes",
      "Break complex topics into manageable, sequential components"
    ],
    right: [
      "Use creative visualization and imaginative learning techniques",
      "Learn through experiential and hands-on approaches",
      "Focus on big-picture thinking and holistic understanding",
      "Practice with artistic expression and intuitive exploration",
      "Connect learning to emotions, stories, and personal experiences"
    ],
    balanced: [
      "Combine structured planning with flexible, creative approaches",
      "Use both analytical and intuitive problem-solving methods",
      "Practice with diverse learning styles and adaptive strategies",
      "Balance detailed focus with comprehensive understanding",
      "Integrate logical analysis with creative insight"
    ]
  }
};

// Enhanced function to get relevant knowledge based on user message and brain dominance
function getRelevantKnowledge(message, brainDominance) {
  const messageText = message.toLowerCase();
  let relevantKnowledge = [];
  
  // Determine subject area with enhanced detection
  let subject = 'general';
  if (messageText.includes('math') || messageText.includes('calculation') || messageText.includes('number') || 
      messageText.includes('algebra') || messageText.includes('geometry') || messageText.includes('calculus')) {
    subject = 'math';
  } else if (messageText.includes('science') || messageText.includes('experiment') || messageText.includes('biology') || 
             messageText.includes('chemistry') || messageText.includes('physics') || messageText.includes('research')) {
    subject = 'science';
  } else if (messageText.includes('language') || messageText.includes('writing') || messageText.includes('reading') || 
             messageText.includes('grammar') || messageText.includes('literature') || messageText.includes('vocabulary')) {
    subject = 'language';
  } else if (messageText.includes('programming') || messageText.includes('code') || messageText.includes('technology') || 
             messageText.includes('computer') || messageText.includes('software') || messageText.includes('web')) {
    subject = 'technology';
  }
  
  // Get knowledge for the brain dominance type
  if (knowledgeBase[subject] && knowledgeBase[subject][brainDominance]) {
    relevantKnowledge = knowledgeBase[subject][brainDominance];
  }
  
  return { subject, strategies: relevantKnowledge };
}

// Enhanced fallback response function when Gemini API is unavailable
function getFallbackResponse(message, brainDominance, knowledgeData) {
  const messageText = message.toLowerCase();
  const { subject, strategies } = knowledgeData;
  
  // Determine response style based on brain dominance
  let responseStyle, greeting, suggestion;
  
  switch (brainDominance.toLowerCase()) {
    case "left":
      greeting = "I'll provide you with a structured, analytical approach to";
      suggestion = "Here are some logical strategies";
      break;
    case "right":
      greeting = "Let me share some creative and intuitive insights about";
      suggestion = "Here are some visual and imaginative approaches";
      break;
    case "balanced":
    default:
      greeting = "I'll help you with a well-rounded approach to";
      suggestion = "Here are some balanced strategies";
      break;
  }
  
  // Generate contextual response
  let response = `${greeting} your ${subject} learning question.\n\n`;
  
  if (strategies.length > 0) {
    response += `${suggestion} for ${brainDominance}-brain learners:\n\n`;
    response += strategies.slice(0, 3).map((strategy, index) => `${index + 1}. ${strategy}`).join('\n\n');
  } else {
    response += `${suggestion} to help you learn effectively. I'm designed to adapt to your ${brainDominance}-brain learning style.`;
  }
  
  response += "\n\n📝 Note: I'm currently using my specialized knowledge base designed for your learning style. This provides brain dominance-adapted responses even when AI services are unavailable.";
  
  return response;
}

// Enhanced function to get user's brain dominance with validation
async function getUserBrainDominance(userId) {
  try {
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    
    const dominance = dbUser?.dominant_side || 'balanced';
    
    // Validate dominance value
    const validDominanceTypes = ['left', 'right', 'balanced'];
    if (!validDominanceTypes.includes(dominance)) {
      console.warn(`⚠️ Invalid brain dominance '${dominance}' for user ${userId}, defaulting to 'balanced'`);
      return 'balanced';
    }
    
    return dominance;
  } catch (error) {
    console.error(`❌ Error fetching brain dominance for user ${userId}:`, error);
    return 'balanced'; // Safe default
  }
}

export async function POST(req) {
  try {
    const { message, chatId, testMode = false } = await req.json();
    
    // Enhanced validation with better error messages
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Message is required and must be a string." },
        { status: 400 }
      );
    }
    
    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }
    
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long. Maximum 2000 characters allowed." },
        { status: 400 }
      );
    }

    // Get current user and their brain dominance with enhanced error handling
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ 
        error: "Authentication required. Please log in to continue.",
        code: "UNAUTHORIZED" 
      }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const clerkUserId = user.id;
    
    console.log(`👤 Processing ${testMode ? 'TEST ' : ''}message for user: ${email}`);
    
    // Enhanced database transaction for user management
    let dbUser;
    try {
      [dbUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      
      if (!dbUser) {
        console.log(`➕ Creating new user record for: ${email}`);
        [dbUser] = await db
          .insert(usersTable)
          .values({
            id: clerkUserId,
            email,
            name: user.fullName || user.firstName || "",
            dominant_side: 'balanced' // Default value
          })
          .returning();
      }
    } catch (dbError) {
      console.error(`💥 Database error for user management:`, dbError);
      return NextResponse.json({ 
        error: "Database connection issue. Please try again.",
        code: "DB_ERROR" 
      }, { status: 500 });
    }
    
    // Get or create chat session with enhanced error handling
    let currentChatId = chatId;
    try {
      if (!currentChatId) {
        console.log(`💬 Creating new chat session for user: ${dbUser.id}`);
        const [newChat] = await db
          .insert(chatsTable)
          .values({
            userId: dbUser.id,
          })
          .returning();
        currentChatId = newChat.id;
      } else {
        // Verify chat belongs to user for security
        const [existingChat] = await db
          .select()
          .from(chatsTable)
          .where(eq(chatsTable.id, parseInt(currentChatId)))
          .limit(1);
        
        if (!existingChat || existingChat.userId !== dbUser.id) {
          return NextResponse.json({ 
            error: "Chat not found or access denied.",
            code: "CHAT_ACCESS_DENIED" 
          }, { status: 403 });
        }
      }
    } catch (chatError) {
      console.error(`💥 Chat management error:`, chatError);
      return NextResponse.json({ 
        error: "Failed to manage chat session. Please try again.",
        code: "CHAT_ERROR" 
      }, { status: 500 });
    }
    
    // Save user message to database with enhanced error handling
    let userMessage;
    try {
      [userMessage] = await db
        .insert(messagesTable)
        .values({
          chatId: currentChatId,
          userId: dbUser.id,
          content: message.trim(), // Ensure no leading/trailing whitespace
        })
        .returning();
      
      console.log(`📝 User message saved: ${userMessage.id}`);
    } catch (messageError) {
      console.error(`💥 Message save error:`, messageError);
      return NextResponse.json({ 
        error: "Failed to save message. Please try again.",
        code: "MESSAGE_SAVE_ERROR" 
      }, { status: 500 });
    }
    
    // Get user's brain dominance with enhanced validation
    const brainDominance = await getUserBrainDominance(dbUser.id);
    console.log(`🧠 User brain dominance: ${brainDominance}`);
    
    // Get relevant knowledge from enhanced RAG system
    const knowledgeData = getRelevantKnowledge(message, brainDominance);
    console.log(`📚 Subject detected: ${knowledgeData.subject}, Strategies: ${knowledgeData.strategies.length}`);
    
    // Enhanced brain dominance prompt logic with more sophisticated personality adaptation
    let personalityPrompt = "";
    let responseStyle = "";
    let communicationStyle = "";

    switch (brainDominance.toLowerCase()) {
      case "left":
        personalityPrompt = `You are a logical, analytical AI tutor who excels at structured, fact-based reasoning. 
        Your responses should be:
        - Clear and step-by-step
        - Well-organized with numbered points or bullet lists
        - Focused on systematic approaches
        - Rich in technical details and data
        - Methodical in problem-solving
        - Emphasizing cause-and-effect relationships`;
        responseStyle = "structured and analytical";
        communicationStyle = "methodical, logical, detail-oriented";
        break;
      case "right":
        personalityPrompt = `You are a creative, empathetic, and intuitive AI tutor who excels at imaginative and holistic thinking.
        Your responses should be:
        - Story-like and engaging
        - Rich in analogies and metaphors
        - Visually descriptive
        - Emotionally connecting
        - Focusing on big-picture concepts
        - Using creative examples and scenarios`;
        responseStyle = "creative and intuitive";
        communicationStyle = "imaginative, empathetic, holistic";
        break;
      case "balanced":
      default:
        personalityPrompt = `You are a balanced AI tutor who seamlessly combines logical analysis with creative insight.
        Your responses should be:
        - Well-structured yet engaging
        - Analytical but friendly
        - Combining systematic approaches with creative examples
        - Balancing details with big-picture thinking
        - Using both logical reasoning and intuitive understanding`;
        responseStyle = "balanced and adaptive";
        communicationStyle = "versatile, comprehensive, well-rounded";
        break;
    }

    // Build enhanced context with RAG knowledge
    let contextualInfo = "";
    if (knowledgeData.strategies.length > 0) {
      const strategiesText = knowledgeData.strategies.slice(0, 3).join('\n');
      contextualInfo = `\n\nRelevant learning strategies for ${brainDominance}-brain dominant learners in ${knowledgeData.subject}:\n${strategiesText}`;
    }

    // Build comprehensive system prompt
    const systemPrompt = `You are an advanced AI learning assistant specifically designed to adapt to different brain dominance types.
    
    USER PROFILE:
    - Brain Dominance: ${brainDominance}
    - Communication Style: ${communicationStyle}
    - Response Style: ${responseStyle}
    - Subject Context: ${knowledgeData.subject}
    
    PERSONALITY ADAPTATION:
    ${personalityPrompt}
    
    CONTEXT:
    ${contextualInfo}
    
    GUIDELINES:
    - Always maintain your ${brainDominance}-brain personality throughout the response
    - Keep responses focused and helpful (3-5 sentences for simple questions, longer for complex topics)
    - If the user asks something unrelated to learning, gently guide them back to educational topics while maintaining your personality
    - Use the provided learning strategies when applicable
    - Be encouraging and supportive while staying true to your communication style
    - Adapt your explanation complexity to match the user's question complexity
    
    Remember: You are not just providing information, you are providing it in a way that resonates with this specific learner's brain type.`;

    // Generate response with Gemini API
    let reply;
    let apiUsed = false;
    let responseGenerationTime;
    
    try {
      const startTime = Date.now();
      
      // Check if Gemini API key is available
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-pro-latest",
        generationConfig: {
          temperature: brainDominance === 'right' ? 0.9 : brainDominance === 'left' ? 0.6 : 0.8,
          topP: 1,
          topK: 40,
          maxOutputTokens: 500,
        }
      });
      
      console.log(`🌡️ Using temperature: ${brainDominance === 'right' ? 0.9 : brainDominance === 'left' ? 0.6 : 0.8} for ${brainDominance}-brain user`);
      
      const result = await model.generateContent([
        systemPrompt,
        `User message: ${message}`
      ]);
      
      reply = result.response.text();
      apiUsed = true;
      responseGenerationTime = Date.now() - startTime;
      console.log(`✅ Gemini API response generated successfully in ${responseGenerationTime}ms`);
      
    } catch (geminiError) {
      console.error(`❌ Gemini API Error:`, {
        message: geminiError.message,
        stack: geminiError.stack
      });
      
      responseGenerationTime = 0;
      
      // Enhanced fallback response
      reply = getFallbackResponse(message, brainDominance, knowledgeData);
      console.log(`🔄 Using fallback response due to Gemini API error`);
    }
    
    // Save AI response to database with enhanced error handling
    let aiMessage;
    try {
      [aiMessage] = await db
        .insert(messagesTable)
        .values({
          chatId: currentChatId,
          userId: "ai-assistant",
          content: reply,
        })
        .returning();
      
      console.log(`🤖 AI message saved: ${aiMessage.id}`);
    } catch (aiMessageError) {
      console.error(`💥 AI message save error:`, aiMessageError);
      // Don't return error here, as the response was generated successfully
      // Just log the error and continue
    }

    // Enhanced response with comprehensive metadata for testing and debugging
    return NextResponse.json({ 
      reply,
      chatId: currentChatId,
      messageId: aiMessage?.id,
      userMessageId: userMessage.id,
      brainDominance,
      subject: knowledgeData.subject,
      relevantStrategies: knowledgeData.strategies,
      responseMetadata: {
        apiUsed,
        apiProvider: "gemini",
        responseStyle,
        communicationStyle,
        strategiesProvided: knowledgeData.strategies.length,
        responseGenerationTime,
        testMode,
        timestamp: new Date().toISOString(),
        version: "2.1" // Updated version for Gemini
      },
      performance: {
        userCreated: !chatId ? "existing" : "new",
        chatSession: currentChatId,
        messagesSaved: {
          user: !!userMessage,
          ai: !!aiMessage
        }
      }
    });
  } catch (error) {
    console.error(`💥 Chat API Error:`, {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Return appropriate error based on error type
    if (error.message?.includes('validation') || error.message?.includes('required')) {
      return NextResponse.json({ 
        error: "Invalid request. Please check your input and try again.",
        code: "VALIDATION_ERROR"
      }, { status: 400 });
    }
    
    if (error.message?.includes('unauthorized') || error.message?.includes('authentication')) {
      return NextResponse.json({ 
        error: "Authentication required. Please log in and try again.",
        code: "AUTH_ERROR"
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: "Sorry, I encountered a technical issue. Please try again in a moment.", 
      code: "INTERNAL_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const testMode = searchParams.get('test') === 'true';
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    
    // Get current user with enhanced validation
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ 
        error: "Authentication required. Please log in to continue.",
        code: "UNAUTHORIZED" 
      }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    
    console.log(`📋 GET request for user: ${email}, chatId: ${chatId || 'all'}, testMode: ${testMode}`);
    
    // Get user from database with error handling
    let dbUser;
    try {
      [dbUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
    } catch (dbError) {
      console.error(`💥 Database error fetching user:`, dbError);
      return NextResponse.json({ 
        error: "Database connection issue. Please try again.",
        code: "DB_ERROR" 
      }, { status: 500 });
    }
    
    if (!dbUser) {
      return NextResponse.json({ 
        messages: [], 
        brainDominance: 'balanced',
        chats: [],
        testMode,
        user: { exists: false }
      });
    }
    
    if (chatId) {
      // Get messages for specific chat with enhanced security and pagination
      try {
        // First verify chat belongs to user
        const [chatOwnership] = await db
          .select()
          .from(chatsTable)
          .where(eq(chatsTable.id, parseInt(chatId)))
          .limit(1);
        
        if (!chatOwnership || chatOwnership.userId !== dbUser.id) {
          return NextResponse.json({
            error: "Chat not found or access denied.",
            code: "CHAT_ACCESS_DENIED"
          }, { status: 403 });
        }
        
        const offset = (page - 1) * limit;
        const messages = await db
          .select({
            id: messagesTable.id,
            content: messagesTable.content,
            userId: messagesTable.userId,
            createdAt: messagesTable.createdAt,
          })
          .from(messagesTable)
          .where(eq(messagesTable.chatId, parseInt(chatId)))
          .orderBy(messagesTable.createdAt)
          .limit(limit)
          .offset(offset);
        
        const formattedMessages = messages.map(msg => ({
          id: msg.id.toString(),
          role: msg.userId === 'ai-assistant' ? 'assistant' : 'user',
          content: msg.content,
          createdAt: msg.createdAt,
          userId: msg.userId
        }));
        
        // Get total message count for pagination
        const [totalCount] = await db
          .select({ count: messagesTable.id })
          .from(messagesTable)
          .where(eq(messagesTable.chatId, parseInt(chatId)));
        
        return NextResponse.json({ 
          messages: formattedMessages,
          brainDominance: dbUser.dominant_side || 'balanced',
          chatId: parseInt(chatId),
          testMode,
          pagination: {
            page,
            limit,
            total: totalCount?.count || 0,
            hasMore: (page * limit) < (totalCount?.count || 0)
          },
          user: {
            id: dbUser.id,
            email: dbUser.email,
            brainDominance: dbUser.dominant_side || 'balanced'
          }
        });
      } catch (messageError) {
        console.error(`💥 Error fetching messages:`, messageError);
        return NextResponse.json({ 
          error: "Failed to fetch messages. Please try again.",
          code: "MESSAGE_FETCH_ERROR" 
        }, { status: 500 });
      }
    } else {
      // Get user's recent chats with enhanced information
      try {
        const chats = await db
          .select({
            id: chatsTable.id,
            createdAt: chatsTable.createdAt,
          })
          .from(chatsTable)
          .where(eq(chatsTable.userId, dbUser.id))
          .orderBy(desc(chatsTable.createdAt))
          .limit(20);
        
        // Get recent activity summary
        const [messageCount] = await db
          .select({ count: messagesTable.id })
          .from(messagesTable)
          .innerJoin(chatsTable, eq(messagesTable.chatId, chatsTable.id))
          .where(eq(chatsTable.userId, dbUser.id));
        
        return NextResponse.json({ 
          chats,
          brainDominance: dbUser.dominant_side || 'balanced',
          userId: dbUser.id,
          testMode,
          stats: {
            totalChats: chats.length,
            totalMessages: messageCount?.count || 0,
            lastActivity: chats[0]?.createdAt || null
          },
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            brainDominance: dbUser.dominant_side || 'balanced'
          }
        });
      } catch (chatError) {
        console.error(`💥 Error fetching chats:`, chatError);
        return NextResponse.json({ 
          error: "Failed to fetch chat history. Please try again.",
          code: "CHAT_FETCH_ERROR" 
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error(`💥 Chat GET Error:`, {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      error: "Failed to fetch data. Please try again.",
      code: "FETCH_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}