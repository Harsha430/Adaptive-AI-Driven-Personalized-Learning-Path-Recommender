import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  lastStreakDate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email: "student@example.com" });
    if (user) {
        console.log("User found:", {
            email: user.email,
            streakDays: user.streakDays,
            lastStreakDate: user.lastStreakDate,
            lastActiveDate: user.lastActiveDate
        });
        
        // Calculate what the server would calculate
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let lastStreakDate = null;
        if (user.lastStreakDate) {
            const d = new Date(user.lastStreakDate);
            lastStreakDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
        
        const daysDifference = lastStreakDate
        ? Math.floor((today - lastStreakDate) / (1000 * 60 * 60 * 24))
        : 0;
        
        console.log("Calculated daysDifference:", daysDifference);
    } else {
        console.log("User student@example.com not found");
    }

  } catch (error) {
    console.error("Error checking user:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser();
