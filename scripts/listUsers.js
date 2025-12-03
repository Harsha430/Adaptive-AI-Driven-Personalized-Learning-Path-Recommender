import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://99220040214_db_user:e5YOmnofE3W65glG@cluster0.lspxh7p.mongodb.net/adaptive_learning?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  streakDays: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log("Users found:", users.map(u => ({ email: u.email, streak: u.streakDays })));

  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    mongoose.connection.close();
  }
}

listUsers();
