<div align="center">

# 🧩 **Kanvas**
### _A MERN-Based Project Management Web Application_

🗂️ Organize • 👥 Collaborate • 📈 Track Progress  

<br/>

<img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,mongodb,js,html,css,git,github" />

<br/><br/>

![Stack](https://img.shields.io/badge/Stack-MERN-00c9a7?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node%20%26%20Express-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

## ✨ Overview

**Kanvas** is a full-stack **project management web application** built using the **MERN stack**.  
It enables users to **organize projects using boards and tasks**, following a **Kanban-style workflow**.

The application focuses on:
- Structured task management
- Clean and intuitive UI
- Secure authentication
- Scalable backend architecture

---

## 🌟 Core Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected API routes
- Auth state managed via Context API

</td>
<td width="50%">

### 📁 Boards (Projects)
- Create and manage boards
- Boards act as project containers
- Fetch user-specific boards

</td>
</tr>

<tr>
<td width="50%">

### ✅ Task Management
- Create, update & delete tasks
- Task status tracking
- Kanban-style workflow (To-do / In-progress / Done)
- Tasks linked to boards

</td>
<td width="50%">

### 📅 Calendar View
- Calendar-based task visualization
- Tasks mapped to dates
- Alternate productivity view

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### 🎨 Frontend
<img src="https://skillicons.dev/icons?i=react,vite,js,html,css" />

- React.js
- Vite
- JavaScript (ES6+)
- HTML5 & CSS3
- Context API
- REST API integration

### ⚙️ Backend
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### 🧰 Tools
<img src="https://skillicons.dev/icons?i=git,github" />

- Git & GitHub
- VS Code

---

## 📁 Project Structure

```text
Kanvas/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardView.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TaskCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   └── taskController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Board.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── boardRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   └── index.js
│
├── .env
└── README.md
```
### ⚙️ Environment Variables

Create a .env file inside the server/ directory:
```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### 🧪 Local Setup

1️⃣ Clone the Repository
```text
git clone https://github.com/your-username/Kanvas.git
cd Kanvas
```

2️⃣ Backend Setup
```text
cd server
npm install
npm start
```


3️⃣ Frontend Setup
```text
cd client
npm install
npm run dev
```

