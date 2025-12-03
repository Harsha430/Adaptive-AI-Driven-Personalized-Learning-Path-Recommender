# 🎓 EduFlow - Adaptive AI-Driven Personalized Learning Path Recommender

![EduFlow Banner](public/homepage.png)

**EduFlow** is a next-generation, full-stack educational platform that leverages Artificial Intelligence to create personalized learning experiences. By analyzing user goals and skill levels, EduFlow generates tailored learning paths, tracks progress with gamification, and provides real-time AI guidance.

---

## 🚀 Key Features

*   **🤖 AI-Powered Learning Paths**: Dynamically generates custom curriculums based on career goals (e.g., "Frontend Developer", "Data Scientist") using the Gemini API.
*   **📊 Interactive Dashboard**: A glassmorphism-styled dashboard to track progress, streaks, and XP points.
*   **🎮 Gamification Engine**:
    *   **XP System**: Earn points for completing modules.
    *   **Streaks**: Daily activity tracking to maintain momentum.
    *   **Leaderboard**: Compete with other learners.
    *   **Badges**: Unlock achievements for milestones.
*   **🧠 AI Content Generator**: Generate quizzes, summaries, and study guides on-demand.
*   **💬 Smart Mentor Chatbot**: An integrated AI assistant to answer questions and identify skill gaps.
*   **📈 Advanced Analytics**: Visual charts (Recharts) for quiz performance and overall mastery.
*   **🔐 Secure Authentication**: JWT-based auth with protected routes.

---

## 🛠️ Tech Stack

### Frontend
*   **React 18**: Component-based UI architecture.
*   **Vite**: Fast build tool and development server.
*   **Tailwind CSS**: Utility-first styling with custom "glassmorphism" design system.
*   **Framer Motion**: Smooth animations and transitions.
*   **Recharts**: Data visualization library.
*   **Axios**: HTTP client for API requests.

### Backend
*   **Node.js & Express**: Robust REST API server.
*   **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
*   **Google Gemini API**: Generative AI for content and path creation.
*   **JWT (JSON Web Tokens)**: Stateless authentication.

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v16 or higher)
*   MongoDB (Local or Atlas URL)
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Harsha430/Adaptive-AI-Driven-Personalized-Learning-Path-Recommender.git
    cd Adaptive-AI-Driven-Personalized-Learning-Path-Recommender
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your secrets:
    ```env
    # Server Configuration
    PORT=5000
    
    # Database
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eduflow?retryWrites=true&w=majority
    
    # Authentication
    JWT_SECRET=your_super_secret_jwt_key_change_this
    
    # AI Configuration
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Start the Application**
    Run both frontend and backend concurrently:
    ```bash
    npm run dev
    # OR
    npm run server # for backend only
    ```

---

## 📂 Project Structure

```
├── src/
│   ├── components/     # Reusable UI components (Navbar, Charts, etc.)
│   ├── pages/          # Application pages (Home, Dashboard, LearningPath)
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application router
│   └── main.jsx        # Entry point
├── server.js           # Express backend server
├── models.js           # Mongoose database schemas
└── README.md           # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ by [Harsha430](https://github.com/Harsha430)*
