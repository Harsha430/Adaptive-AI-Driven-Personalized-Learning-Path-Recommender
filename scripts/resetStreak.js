import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xpPoints: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  lastStreakDate: { type: Date, default: Date.now },
  skills: { type: [String], default: [] },
  goals: { type: [String], default: [] },
});

const User = mongoose.model("User", userSchema);

async function resetStreak() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find users matching "student" or "gmail"
    const users = await User.find({ email: { $regex: "student|gmail", $options: "i" } });
    
    if (users.length === 0) {
      console.log("No matching users found.");
    } else {
      console.log(`Found ${users.length} users. Resetting streaks...`);
      for (const user of users) {
        console.log(`Resetting streak for: ${user.email}`);
        user.streakDays = 0;
        // Set lastStreakDate to 4 days ago to ensure logic sees a gap if checked
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        user.lastStreakDate = fourDaysAgo;
        
        await user.save();
        console.log(`Streak reset to 0 for ${user.email}`);
      }
    }

  } catch (error) {
    console.error("Error resetting streak:", error);
  } finally {
    mongoose.connection.close();
  }
}

resetStreak();
