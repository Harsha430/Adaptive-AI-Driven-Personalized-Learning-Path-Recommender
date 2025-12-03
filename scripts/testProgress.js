import axios from "axios";

const API_URL = "http://localhost:5000/api";

async function testProgress() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: "student@example.com",
      password: "password123",
    });
    const token = loginRes.data.token;
    console.log("Logged in. Token received.");

    // 2. Get Progress
    console.log("Fetching progress...");
    const progressRes = await axios.get(`${API_URL}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Streak Days:", progressRes.data.streakDays);

  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

testProgress();
