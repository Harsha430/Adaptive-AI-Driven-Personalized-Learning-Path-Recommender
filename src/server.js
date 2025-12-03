import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
import {
  User,
  LearningPath,
  Progress,
  Quiz,
  ChatbotInteraction,
  Thread,
  Post,
} from "./models.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

// Gemini AI Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// If a key is present, also set the common env var some clients expect so
// the underlying library can pick it up. This helps when library versions
// expect GOOGLE_API_KEY in env rather than a direct constructor argument.
if (GEMINI_API_KEY) {
  process.env.GOOGLE_API_KEY = GEMINI_API_KEY;
}

let genAI;
let model;
try {
  // Try the simple constructor first (existing usage). If the library
  // expects an options object, fall back to that.
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (e) {
    genAI = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });
  }

  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
} catch (err) {
  console.warn(
    "Could not initialize Google Generative AI client. Gemini features will use fallbacks.",
    err?.message || err
  );
  genAI = null;
  model = null;
}

// Middleware
app.use(cors());
app.use(express.json());

// Fallback quiz generation function
function generateFallbackQuiz(module) {
  const topic = module.title;
  return [
    {
      question: `What is the main focus of "${topic}"?`,
      options: [
        "Understanding core concepts and fundamentals",
        "Advanced implementation techniques",
        "Historical background only",
        "Unrelated technical details",
      ],
      correctAnswer: "Understanding core concepts and fundamentals",
    },
    {
      question: `Which approach is most effective when learning ${topic}?`,
      options: [
        "Memorizing without practice",
        "Hands-on practice with real examples",
        "Reading documentation only",
        "Avoiding practical exercises",
      ],
      correctAnswer: "Hands-on practice with real examples",
    },
    {
      question: `What is a key benefit of mastering ${topic}?`,
      options: [
        "It has no practical applications",
        "It improves problem-solving skills and technical knowledge",
        "It only helps with theoretical understanding",
        "It replaces the need for other skills",
      ],
      correctAnswer:
        "It improves problem-solving skills and technical knowledge",
    },
    {
      question: `When working with ${topic}, what should you prioritize?`,
      options: [
        "Speed over understanding",
        "Understanding fundamentals before advanced topics",
        "Skipping basic concepts",
        "Focusing only on complex scenarios",
      ],
      correctAnswer: "Understanding fundamentals before advanced topics",
    },
    {
      question: `How can you best apply knowledge from ${topic}?`,
      options: [
        "Keep it theoretical only",
        "Build practical projects and solve real problems",
        "Avoid real-world applications",
        "Focus on memorization techniques",
      ],
      correctAnswer: "Build practical projects and solve real problems",
    },
  ];
}

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth header:", authHeader);
  console.log("Token:", token ? "Token present" : "No token");

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    console.log("Token verified for user:", user.id);
    req.user = user;
    next();
  });
};

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Routes

// Get user profile
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ skills: user.skills || [], goals: user.goals || [] });
  } catch (e) {
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Profile intake: update skills and goals
app.post("/api/profile", authenticateToken, async (req, res) => {
  try {
    const { skills = [], goals = [] } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills, goals },
      { new: true }
    );
    res.json({ skills: user.skills, goals: user.goals });
  } catch (e) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// API status check
app.get("/api/status", authenticateToken, async (req, res) => {
  res.json({
    apiConnected: !!model,
    apiProvider: "Gemini AI",
  });
});

// AI-based learning path generation
app.post("/api/learning-path/generate", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      goal = user?.goals?.[0] || "Software Engineer",
      level = "beginner",
    } = req.body;

    let modules = [];
    if (!model) {
      modules = [
        {
          title: `${goal}: Foundations`,
          description: `Core ${goal} concepts and tools for a ${level} learner.`,
        },
        {
          title: `Essential Tools`,
          description: "Setup environment, CLI, Git, and project structure.",
        },
        {
          title: "Core Concepts I",
          description: "First fundamentals with small exercises.",
        },
        {
          title: "Core Concepts II",
          description: "Applied mini-projects and review.",
        },
        {
          title: "Project 1",
          description: "Build a practical app using learned concepts.",
        },
        {
          title: "Project 2",
          description: "Extend the app with auth and data storage.",
        },
      ];
    } else {
      try {
        const prompt = `Create a sequenced learning path to become ${goal} for a ${level} learner.
        Return a JSON array of 6-10 objects. Each object must have these keys:
        - title: string
        - description: string
        - resources: array of 2-3 objects, where each resource object has:
          - title: string (name of the video or article)
          - type: string (either "video" or "article")
          - url: string (a valid, real URL to a YouTube video or a high-quality article/documentation)
        
        Ensure the URLs are real and relevant to the topic.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response
          .text()
          .replace(/```json|```/g, "")
          .trim();
        modules = JSON.parse(text);
        if (!Array.isArray(modules) || modules.length === 0)
          throw new Error("Empty modules");
      } catch (err) {
        console.warn("AI generation failed, using fallback:", err?.message);
        modules = [
          {
            title: `${goal}: Foundations`,
            description: `Core ${goal} concepts and tools for a ${level} learner.`,
          },
          {
            title: `Essential Tools`,
            description: "Setup environment, CLI, Git, and project structure.",
          },
          {
            title: "Core Concepts I",
            description: "First fundamentals with small exercises.",
          },
          {
            title: "Core Concepts II",
            description: "Applied mini-projects and review.",
          },
          {
            title: "Project 1",
            description: "Build a practical app using learned concepts.",
          },
          {
            title: "Project 2",
            description: "Extend the app with auth and data storage.",
          },
        ];
      }
    }

    const pathDoc = await LearningPath.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        modules: modules.map((m) => ({ ...m, completed: false })),
      },
      { new: true, upsert: true }
    );
    res.json(pathDoc);
  } catch (e) {
    console.error("Generation error", e);
    res.status(500).json({ error: "Failed to generate learning path" });
  }
});

// Forum: create thread
app.post("/api/forum/threads", authenticateToken, async (req, res) => {
  try {
    const { title, tags = [] } = req.body;
    const thread = await Thread.create({ title, tags, authorId: req.user.id });
    res.status(201).json(thread);
  } catch (e) {
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// Forum: list threads
app.get("/api/forum/threads", authenticateToken, async (_req, res) => {
  const threads = await Thread.find({}).sort({ updatedAt: -1 }).limit(50);
  res.json(threads);
});

// Forum: create post
app.post("/api/forum/posts", authenticateToken, async (req, res) => {
  try {
    const { threadId, content } = req.body;
    const post = await Post.create({
      threadId,
      content,
      authorId: req.user.id,
    });
    await Thread.findByIdAndUpdate(threadId, { updatedAt: new Date() });
    res.status(201).json(post);
  } catch (e) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Mentor matching: naive by shared goals or complementary skills
app.get("/api/mentors/match", authenticateToken, async (req, res) => {
  const me = await User.findById(req.user.id);
  const goal = me?.goals?.[0];
  if (!goal) return res.json([]);
  const candidates = await User.find({ _id: { $ne: me._id }, goals: goal })
    .select("email skills goals xpPoints")
    .limit(10);
  res.json(candidates);
});
// User Registration
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      xpPoints: 0,
      streakDays: 0,
      lastActiveDate: new Date(),
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email }); // Log the login attempt
  try {
    const user = await User.findOne({ email });
    console.log("User found:", user); // Log the user found
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid); // Log password validation
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).json({ error: "Error logging in" });
  }
});

// Get Learning Path
app.get("/api/learning-path", authenticateToken, async (req, res) => {
  try {
    const learningPath = await LearningPath.findOne({ userId: req.user.id });
    res.status(200).json(learningPath);
  } catch (error) {
    res.status(500).json({ error: "Error fetching learning path" });
  }
});

// Get Progress and User Data with Streak Check
app.get("/api/progress", authenticateToken, async (req, res) => {
  console.log("GET /api/progress called for user:", req.user.id);
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id);

    console.log("Progress found:", progress);
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check for streak reset (if user has been inactive for > 3 days)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let lastStreakDate = null;
    if (user.lastStreakDate) {
      const d = new Date(user.lastStreakDate);
      lastStreakDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    } else if (user.lastActiveDate) {
      // Fallback for existing users
      const d = new Date(user.lastActiveDate);
      lastStreakDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    const daysDifference = lastStreakDate
      ? Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24))
      : 0;

    let currentStreak = user.streakDays || 0;
    
    // Reset Rule: If gap > 3 days (missed 3 full days), reset to 0
    if (daysDifference > 3 && currentStreak > 0) {
      console.log(`Streak reset! Gap: ${daysDifference} days. Resetting to 0.`);
      currentStreak = 0;
      // We update the DB immediately so the user sees 0
      await User.findByIdAndUpdate(req.user.id, { streakDays: 0 });
    }

    // Just return current user data - streak updates happen via dedicated endpoint
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { lastActiveDate: new Date() },
      { new: true }
    );

    res.status(200).json({
      overallProgress: progress ? progress.overallProgress : 0,
      quizScores: progress ? progress.quizScores : [],
      xpPoints: updatedUser.xpPoints || 0,
      streakDays: currentStreak, // Return the potentially reset streak
      lastActiveDate: updatedUser.lastActiveDate,
    });
  } catch (error) {
    console.error("Error in GET /api/progress:", error);
    res.status(500).json({ error: "Error fetching progress" });
  }
});

// Update Progress
app.post("/api/progress", authenticateToken, async (req, res) => {
  const { overallProgress, quizScores } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { overallProgress, quizScores },
      { new: true, upsert: true }
    );
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Error updating progress" });
  }
});

// Update Module Completion
app.patch(
  "/api/learning-path/module/:moduleId",
  authenticateToken,
  async (req, res) => {
    const { moduleId } = req.params;
    const { completed } = req.body;

    console.log(
      "Updating module:",
      moduleId,
      "to completed:",
      completed,
      "for user:",
      req.user.id
    );

    try {
      const learningPath = await LearningPath.findOneAndUpdate(
        {
          userId: req.user.id,
          "modules._id": moduleId,
        },
        {
          $set: { "modules.$.completed": completed },
        },
        { new: true }
      );

      if (!learningPath) {
        console.log(
          "Learning path or module not found for moduleId:",
          moduleId
        );
        return res
          .status(404)
          .json({ error: "Learning path or module not found" });
      }

      console.log(
        "Updated learning path modules:",
        learningPath.modules.map((m) => ({
          id: m._id,
          title: m.title,
          completed: m.completed,
        }))
      );
      res.status(200).json(learningPath);
    } catch (error) {
      console.error("Error updating module:", error);
      res.status(500).json({ error: "Error updating module completion" });
    }
  }
);

// Add Gamification Features

// Update XP Points with Database Save
app.post("/api/xp", authenticateToken, async (req, res) => {
  const { xpPoints } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { xpPoints } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ xpPoints: user.xpPoints });
  } catch (error) {
    console.error("Error updating XP points:", error);
    res.status(500).json({ error: "Error updating XP points" });
  }
});

// Get Leaderboard with Database Query
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await User.find({}, "email xpPoints")
      .sort({ xpPoints: -1 })
      .limit(10);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Error fetching leaderboard" });
  }
});

// Update Streak with Date-based Logic
app.post("/api/streak", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today

    let lastStreakDate = null;
    // Use lastStreakDate for calculation, fallback to lastActiveDate for migration
    if (user.lastStreakDate) {
      const d = new Date(user.lastStreakDate);
      lastStreakDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    } else if (user.lastActiveDate) {
      const d = new Date(user.lastActiveDate);
      lastStreakDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    const daysDifference = lastStreakDate
      ? Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24))
      : 999;

    console.log(
      `Streak check - User: ${user.email}, Today: ${today.toDateString()}, Last Streak Date: ${
        lastStreakDate ? lastStreakDate.toDateString() : "Never"
      }, Gap: ${daysDifference}, Current Streak: ${user.streakDays || 0}`
    );

    let newStreakDays = user.streakDays || 0;

    if (daysDifference === 0) {
      // Same day activity - no change to streak count
      console.log("Same day activity - streak maintained");
    } else if (daysDifference === 1) {
      // Consecutive day - increment streak
      newStreakDays = (user.streakDays || 0) + 1;
      console.log(`Consecutive day - streak incremented to ${newStreakDays}`);
    } else if (daysDifference <= 3) {
      // Gap of 2-3 days (missed 1-2 days) - Grace period, maintain streak
      // But we update the date so they don't lose it tomorrow
      console.log(`${daysDifference} days gap (Grace Period) - streak maintained at ${newStreakDays}`);
    } else {
      // Gap > 3 days - Reset to 1 (Start fresh today)
      newStreakDays = 1;
      console.log(`${daysDifference} days gap - streak reset to 1`);
    }

    // Update user with new streak and today's date as lastStreakDate
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        streakDays: newStreakDays,
        lastActiveDate: now,
        lastStreakDate: now, // Important: Update this only on streak-worthy activity
      },
      { new: true }
    );

    console.log(`Final updated streak: ${updatedUser.streakDays} days`);
    res.status(200).json({
      streakDays: updatedUser.streakDays,
      lastActiveDate: updatedUser.lastActiveDate,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ error: "Error updating streak" });
  }
});

// Gemini AI Chatbot Endpoint
app.post("/api/chatbot", authenticateToken, async (req, res) => {
  const { message, context } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Create context-aware prompt
    const systemPrompt = `You are an AI learning assistant for an adaptive learning platform. 
    
User Profile:
- Email: ${user.email}
- Current XP: ${user.xpPoints}
- Streak: ${user.streakDays} days
- Skills: ${user.skills ? user.skills.join(", ") : "Not specified"}
- Goals: ${user.goals ? user.goals.join(", ") : "Not specified"}

You should provide helpful, personalized learning advice, answer questions about the content, and encourage the user's learning journey. Keep responses concise and engaging.

User message: ${message}`;

    let aiResponse = "";
    if (!model) {
      aiResponse =
        "AI service unavailable. Try again later or set a valid GEMINI_API_KEY.";
    } else {
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      aiResponse = response.text();
    }

    // Save interaction to database
    const interaction = new ChatbotInteraction({
      userId: req.user.id,
      userMessage: message,
      botResponse: aiResponse,
      timestamp: new Date(),
      context: context || {},
    });
    await interaction.save();

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error with Gemini AI:", error);
    res.status(500).json({
      error:
        "Sorry, I'm having trouble responding right now. Please try again.",
      details: error.message,
    });
  }
});

// Generate Learning Content with Gemini AI
app.post("/api/generate-content", authenticateToken, async (req, res) => {
  const { topic, type, difficulty } = req.body;

  try {
    const user = await User.findById(req.user.id);

    let prompt = "";

    switch (type) {
      case "explanation":
        prompt = `Create a clear, engaging explanation of "${topic}" suitable for ${difficulty} level learners. Include practical examples and make it easy to understand.`;
        break;
      case "quiz":
        prompt = `Generate 5 multiple-choice quiz questions about "${topic}" at ${difficulty} level. Format as JSON with question, options (A-D), and correct answer.`;
        break;
      case "practice":
        prompt = `Create 3 practical exercises or projects related to "${topic}" for ${difficulty} level. Include step-by-step instructions.`;
        break;
      case "summary":
        prompt = `Create a concise summary of key points about "${topic}" for ${difficulty} level learners. Use bullet points and include main concepts.`;
        break;
      default:
        prompt = `Generate helpful learning content about "${topic}" for ${difficulty} level learners.`;
    }

    let generatedContent = "";
    if (!model) {
      generatedContent = `Basic content about ${topic}.`;
    } else {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      generatedContent = response.text();
    }

    res.json({
      content: generatedContent,
      topic,
      type,
      difficulty,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({
      error: "Failed to generate content",
      details: error.message,
    });
  }
});

// Get or Generate Quiz for Module
app.get("/api/quiz/module/:moduleId", authenticateToken, async (req, res) => {
  try {
    const { moduleId } = req.params;
    console.log("Quiz endpoint called with moduleId:", moduleId);

    // First check if quiz already exists for this module
    let quiz = await Quiz.findOne({ moduleId });
    console.log("Existing quiz found:", quiz ? "Yes" : "No");

    if (!quiz) {
      // Get module details to generate appropriate quiz
      console.log("Searching for learning path with module:", moduleId);

      // Try to find the learning path that contains this module
      const learningPaths = await LearningPath.find({});
      console.log("Total learning paths found:", learningPaths.length);

      let module = null;
      let foundPath = null;

      for (const path of learningPaths) {
        const foundModule = path.modules.find(
          (m) => m._id.toString() === moduleId
        );
        if (foundModule) {
          module = foundModule;
          foundPath = path;
          break;
        }
      }

      console.log("Module found:", module ? "Yes" : "No");

      if (!module) {
        console.log("Module not found in any learning path");
        return res
          .status(404)
          .json({ error: "Module not found in any learning path" });
      }

      // Generate quiz using Gemini AI or fallback
      let questions = [];

      if (model) {
        try {
          const prompt = `Generate 5 multiple-choice quiz questions about "${module.title}: ${module.description}" at intermediate level. 
          Format as JSON array with objects containing:
          - question: string
          - options: array of 4 strings (A, B, C, D options)
          - correctAnswer: string (should be one of the options)
          
          Make the questions practical and test understanding of the topic.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          let generatedContent = response.text();

          // Clean and parse JSON
          generatedContent = generatedContent
            .replace(/```json|```/g, "")
            .trim();
          questions = JSON.parse(generatedContent);
        } catch (aiError) {
          console.warn(
            "AI quiz generation failed, using fallback:",
            aiError.message
          );
          questions = generateFallbackQuiz(module);
        }
      } else {
        console.log("No API key, using fallback quiz");
        questions = generateFallbackQuiz(module);
      }

      // Create and save quiz
      quiz = new Quiz({
        moduleId,
        questions,
      });
      await quiz.save();
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching/generating quiz:", error);
    res.status(500).json({ error: "Failed to load quiz" });
  }
});

// Submit Quiz Results
app.post("/api/quiz/submit", authenticateToken, async (req, res) => {
  try {
    const { moduleId, answers, score, totalQuestions } = req.body;

    // Update user's progress with quiz score
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        overallProgress: 0,
        quizScores: [],
      });
    }

    // Add or update quiz score for this module
    const existingScoreIndex = progress.quizScores.findIndex(
      (qs) => qs.moduleId && qs.moduleId.toString() === moduleId
    );

    const quizScore = {
      moduleId,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      completedAt: new Date(),
    };

    if (existingScoreIndex >= 0) {
      progress.quizScores[existingScoreIndex] = quizScore;
    } else {
      progress.quizScores.push(quizScore);
    }

    await progress.save();

    // Award XP for quiz completion (bonus for high scores)
    const baseXP = 30;
    const bonusXP =
      score === totalQuestions ? 20 : score >= totalQuestions * 0.8 ? 10 : 0;
    const totalXP = baseXP + bonusXP;

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { xpPoints: totalXP },
    });

    // Update streak for quiz completion
    const user = await User.findById(req.user.id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let lastActiveDate = null;
    if (user.lastActiveDate) {
      const lastActiveDateTime = new Date(user.lastActiveDate);
      lastActiveDate = new Date(
        lastActiveDateTime.getFullYear(),
        lastActiveDateTime.getMonth(),
        lastActiveDateTime.getDate()
      );
    }

    const daysDifference = lastActiveDate
      ? Math.floor((today - lastActiveDate) / (1000 * 60 * 60 * 24))
      : 999;
    let newStreakDays = user.streakDays || 0;

    if (daysDifference === 0 && newStreakDays > 0) {
      // Same day and already has a streak - no change
    } else if (daysDifference === 0 && newStreakDays === 0) {
      // First activity ever - start streak at 1
      newStreakDays = 1;
    } else if (daysDifference === 1) {
      // Consecutive day - increment
      newStreakDays = (user.streakDays || 0) + 1;
    } else if (daysDifference > 1) {
      // First time or gap - start with 1
      newStreakDays = 1;
    }

    await User.findByIdAndUpdate(req.user.id, {
      streakDays: newStreakDays,
      lastActiveDate: now,
    });

    console.log(
      `Quiz completion - User: ${user.email}, Streak updated to: ${newStreakDays}`
    );

    res.json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions,
      percentage: quizScore.percentage,
      xpAwarded: totalXP,
      streakDays: newStreakDays,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

// Get Chatbot History
app.get("/api/chatbot/history", authenticateToken, async (req, res) => {
  try {
    const interactions = await ChatbotInteraction.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(interactions);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Error fetching chat history" });
  }
});

// Get Streak Status
app.get("/api/streak-status", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(user.lastActiveDate || new Date());
    lastActive.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor(
      (today - lastActive) / (1000 * 60 * 60 * 24)
    );

    res.json({
      streakDays: user.streakDays,
      lastActiveDate: user.lastActiveDate,
      daysSinceLastActive: daysDifference,
      shouldReset: daysDifference >= 3,
      userId: user._id,
      email: user.email,
      today: today.toISOString(),
      lastActiveFormatted: lastActive.toISOString(),
    });
  } catch (error) {
    console.error("Error getting streak status:", error);
    res.status(500).json({ error: "Error getting streak status" });
  }
});

// Debug endpoint to check user data
app.get("/api/debug/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      id: user._id,
      email: user.email,
      streakDays: user.streakDays,
      lastActiveDate: user.lastActiveDate,
      xpPoints: user.xpPoints,
      skills: user.skills,
      goals: user.goals,
    });
  } catch (error) {
    console.error("Error getting user debug info:", error);
    res.status(500).json({ error: "Error getting user debug info" });
  }
});

// Debug endpoint to test AI connectivity (returns success or error details)
app.post("/api/debug/test-ai", authenticateToken, async (req, res) => {
  if (!model) {
    return res
      .status(503)
      .json({
        ok: false,
        message: "AI client not initialized or GEMINI_API_KEY missing",
      });
  }

  try {
    const prompt = req.body.prompt || "Say hello in one sentence.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ ok: true, text });
  } catch (error) {
    console.error("AI test call failed:", error);
    res.status(500).json({ ok: false, error: error.message || String(error) });
  }
});

// Force streak update for testing
app.post("/api/debug/force-streak", authenticateToken, async (req, res) => {
  try {
    console.log("FORCE STREAK UPDATE called for user:", req.user.id);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Current user data:", {
      email: user.email,
      streakDays: user.streakDays,
      lastActiveDate: user.lastActiveDate,
      xpPoints: user.xpPoints,
    });

    // Force set streak to 1 for testing
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        streakDays: 1,
        lastActiveDate: new Date(),
      },
      { new: true }
    );

    console.log("Updated user data:", {
      email: updatedUser.email,
      streakDays: updatedUser.streakDays,
      lastActiveDate: updatedUser.lastActiveDate,
    });

    res.json({
      message: "Streak forced to 1",
      streakDays: updatedUser.streakDays,
      lastActiveDate: updatedUser.lastActiveDate,
    });
  } catch (error) {
    console.error("Error forcing streak:", error);
    res.status(500).json({ error: "Error forcing streak" });
  }
});

// Simple endpoint to get current streak
app.get("/api/current-streak", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      streakDays: user.streakDays || 0,
      lastActiveDate: user.lastActiveDate,
      xpPoints: user.xpPoints || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Error getting streak" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
