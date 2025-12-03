import mongoose from "mongoose";
import { User } from "../src/models.js";

const MONGO_URI = process.env.MONGO_URI ||
  "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

async function updateUsersWithLastActiveDate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Ensure lastActiveDate and normalize streakDays
    const result = await User.updateMany(
      {},
      [
        {
          $set: {
            lastActiveDate: {
              $ifNull: ["$lastActiveDate", new Date()],
            },
            streakDays: {
              $cond: [{ $isNumber: "$streakDays" }, "$streakDays", 0],
            },
          },
        },
      ]
    );

    console.log(
      `Updated ${result.modifiedCount} users with lastActiveDate and reset streaks`
    );

    await mongoose.disconnect();
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

updateUsersWithLastActiveDate();
