# 📊 TubeAnalytics

A full-stack **YouTube Analytics + Sentiment Analysis Dashboard** built using the MERN stack.  
It fetches real YouTube data, analyzes comments using sentiment analysis, and visualizes insights using interactive charts.

---

# 👤 Author
- GitHub: [DalipSingh34](https://github.com/DalipSingh34)
- Project: Tube-Analytics

---

# 📌 Features

## 🎥 YouTube Integration
- Fetch video details using YouTube Data API v3
- Get real-time:
  - Views
  - Likes
  - Comments count
  - Top comments

## 💬 Sentiment Analysis
- Positive comments detection
- Negative comments detection
- Neutral comments detection
- Score-based sentiment classification

## 📊 Data Visualization
- Pie Chart (Sentiment distribution)
- Bar Chart (Comments vs Likes)
- Real-time analytics dashboard

## 🕒 History Tracking
- Stores searched videos
- Displays past analytics
- Click to re-analyze instantly

## 🌙 UI Features
- Dark Mode / Light Mode toggle
- Responsive dashboard UI
- Modern SaaS-style design

## 🔐 Authentication
- JWT-based login system
- Protected routes
- Secure user sessions

---

# 🛠 Tech Stack

## Frontend
- React.js
- Recharts (Graphs)
- Axios
- React Router DOM
- React Toastify
- React Icons

## Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- YouTube Data API v3
- JWT Authentication
- Axios

---

# 📁 Project Structure


Tube-Analytics/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── middleware/
│ └── server.js
│ └── app.js

├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│
└── README.md


---

# ⚙️ Setup Instructions (Step-by-Step)

# 1️⃣ Clone Repository

```bash
git clone https://github.com/DalipSingh34/Tube-Analytics.git
cd Tube-Analytics
2️⃣ Backend Setup
cd backend
npm install
🔑 Create .env file in backend folder
PORT=3002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
YT_API_KEY=your_youtube_api_key
📌 How to get MONGO_URI (MongoDB)
Go to: https://www.mongodb.com/cloud/atlas
Create account
Create new cluster (FREE)
Go to Database Access
Create username + password
Go to Network Access
Allow 0.0.0.0/0
Go to Connect → Drivers
Copy connection string like:
mongodb+srv://<username>:<password>@cluster0.mongodb.net/tubeanalytics
📌 How to get YouTube API Key (IMPORTANT)
Go to Google Cloud Console:
https://console.cloud.google.com/
Create new project

Enable API:

YouTube Data API v3

Go to:

APIs & Services → Credentials

Click:

Create Credentials → API Key
Copy API key and add to .env
▶️ Run Backend
npm start

Backend runs on:

http://localhost:3002
3️⃣ Frontend Setup
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:5173
🔄 How It Works
User enters YouTube Video ID
Backend calls YouTube API:
video stats
comments
Sentiment analysis runs on comments
Data stored in MongoDB
Frontend displays:
Pie chart (sentiment)
Bar chart (likes vs comments)
Analytics cards
📊 API Endpoints (Backend)
Auth
POST /api/auth/register
POST /api/auth/login
YouTube Analysis
GET /api/youtube/search?videoId=XYZ&order=relevance
History
GET /api/history
📈 Dashboard Metrics
Metric	Source
Views	YouTube API
Likes	YouTube API
Comments	YouTube API
Sentiment	AI/Logic Layer
🌟 Future Improvements
🤖 AI comment summarizer (ChatGPT integration)
📊 Engagement rate analytics
📈 Trend graphs over time
🎥 Multi-video comparison
📱 Mobile app version
🧠 Learning Outcomes

This project demonstrates:

Full-stack MERN development
REST API integration
External API usage (YouTube Data API)
Data visualization
Authentication & security
Real-world dashboard design
📄 License

This project is for educational and portfolio purposes.

⭐ Support

If you like this project:

⭐ Star the repo
🍴 Fork it
🚀 Improve it
👨‍💻 Developer

Made with ❤️ by Dalip Singh (DalipSingh34)