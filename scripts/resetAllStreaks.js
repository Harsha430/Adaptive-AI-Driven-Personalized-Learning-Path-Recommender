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

async function resetAllStreaks() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const result = await User.updateMany({}, {
      $set: {
        streakDays: 0,
        lastStreakDate: fourDaysAgo
      }
    });

    console.log(`Reset complete. Modified ${result.modifiedCount} users.`);

  } catch (error) {
    console.error("Error resetting streaks:", error);
  } finally {
    mongoose.connection.close();
  }
}

resetAllStreaks();
