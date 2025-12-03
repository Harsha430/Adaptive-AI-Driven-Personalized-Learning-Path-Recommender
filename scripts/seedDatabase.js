import mongoose from "mongoose";
import bcrypt from "bcrypt";

const MONGO_URI = process.env.MONGO_URI ||
  "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xpPoints: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
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

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany();
    await LearningPath.deleteMany();
    await Progress.deleteMany();
    await Quiz.deleteMany();
    await ChatbotInteraction.deleteMany();

    // Insert sample data
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      email: "student@example.com",
      password: hashedPassword,
      skills: ["JavaScript", "HTML", "CSS"],
      goals: ["Front-end Developer"],
    });

    const learningPath = await LearningPath.create({
      userId: user._id,
      modules: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Module 1",
          description: "Introduction to Adaptive Learning",
          completed: false,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Module 2",
          description: "Advanced Topics",
          completed: false,
        },
      ],
    });

    await Progress.create({
      userId: user._id,
      overallProgress: 50,
      quizScores: [
        { moduleId: learningPath.modules[0]._id, score: 4, totalQuestions: 5, percentage: 80, completedAt: new Date() },
      ],
    });

    await Quiz.create({
      moduleId: learningPath.modules[0]._id,
      questions: [
        {
          question: "What is adaptive learning?",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
        },
      ],
    });

    await ChatbotInteraction.create({
      userId: user._id,
      userMessage: "I want to improve in front-end",
      botResponse: "Start with modern React patterns and a UI project.",
      context: { source: "seed" },
      careerGoal: "Software Engineer",
      skillGaps: ["Data Structures", "Algorithms"],
      recommendedPath: "Complete Module 1 and Module 2",
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
