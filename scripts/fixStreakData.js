import mongoose from "mongoose";
import { User } from "../src/models.js";

const MONGO_URI = process.env.MONGO_URI ||
  "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

async function fixStreakData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all users and fix their streak data
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      const updates = {};
      
      // Initialize streak if missing
      if (user.streakDays === undefined || user.streakDays === null) {
        updates.streakDays = 0;
      }
      
      // Initialize lastActiveDate if missing
      if (!user.lastActiveDate) {
        updates.lastActiveDate = new Date();
      }
      
      // Initialize xpPoints if missing
      if (user.xpPoints === undefined || user.xpPoints === null) {
        updates.xpPoints = 0;
      }

      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, updates);
        console.log(`Updated user ${user.email}:`, updates);
      }
    }

    console.log("Streak data fix completed");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing streak data:", error);
    process.exit(1);
  }
}

fixStreakData();