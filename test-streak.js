import axios from 'axios';

// Test the streak endpoint
async function testStreak() {
  try {
    // You'll need to replace this with a valid token from your browser's localStorage
    const token = 'your_token_here';
    
    console.log('Testing streak endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/streak', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Streak response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testStreak();