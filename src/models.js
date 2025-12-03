import mongoose from "mongoose";

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xpPoints: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  lastStreakDate: { type: Date, default: Date.now },
  // Personalization fields
  skills: { type: [String], default: [] },
  goals: { type: [String], default: [] },
});

const learningPathSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  modules: [
    {
      title: String,
      description: String,
      completed: { type: Boolean, default: false },
    },
  ],
});

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  overallProgress: { type: Number, default: 0 },
  quizScores: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId },
      score: Number,
      totalQuestions: Number,
      percentage: Number,
      completedAt: Date,
    },
  ],
});

const quizSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LearningPath",
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const chatbotInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now },
  context: { type: Object, default: {} },
  // Optional structured insights captured over time
  careerGoal: String,
  skillGaps: [String],
  recommendedPath: String,
});

// Define models
const User = mongoose.model("User", userSchema);
const LearningPath = mongoose.model("LearningPath", learningPathSchema);
const Progress = mongoose.model("Progress", progressSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const ChatbotInteraction = mongoose.model(
  "ChatbotInteraction",
  chatbotInteractionSchema
);

export { User, LearningPath, Progress, Quiz, ChatbotInteraction };

// ----- Community models -----
const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Thread = mongoose.model("Thread", threadSchema);
const Post = mongoose.model("Post", postSchema);

export { Thread, Post };
