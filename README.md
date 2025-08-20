# Blog Admin Panel

A **MERN stack** admin dashboard for managing blog content, equipped with **AI-powered SEO tools** for keyword analysis and meta description generation.  
Built with **React, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication**.

---

## 🚀 Live Demo
Live Link :(https://admin-blog-panel-1.onrender.com) 

---

## 📌 Features
- 🔐 **User Authentication** (JWT)
- ✏️ Create, edit, delete blog posts
- 📂 Manage blog categories
- 📱 Responsive UI (Tailwind CSS)
- 🤖 **AI Keyword Analyzer** – Suggests high-impact keywords for better SEO
- 📝 **AI Meta Description Generator** – Creates optimized meta descriptions for blog posts
- 🔒 Secure API endpoints

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express, JWT
- **Database:** MongoDB (Mongoose)
- **AI Integration:** OpenAI API
- **Deployment:** Render

---

## 📦 Installation (Local)
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/admin-blog-panel.git

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Create a .env file in backend with:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000

# Run frontend
npm run dev

# Run backend
npm start
