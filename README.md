<div align="center">



# 🧩 **Kanvas**
### _A Project Management Web Application_

🗂️ Organize • 👥 Collaborate • 📈 Track Progress  

<br/>

<img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,mongodb,js,html,css,git,github" />

<br/><br/>

![MERN](https://img.shields.io/badge/Stack-MERN-00c9a7?style=for-the-badge)
![Vite](https://img.shields.io/badge/Bundler-Vite-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

## ✨ Overview

**Kanvas** is a full-stack **project management web application** designed to help users  
plan projects, manage tasks, and visualize progress efficiently.

It provides a **board-based workflow** where tasks can be created, updated, and tracked  
with an intuitive and responsive user interface.

---

## 🌟 Key Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- Secure user login & signup
- JWT-based authentication
- Protected routes

</td>
<td width="50%">

### 📋 Boards & Projects
- Create multiple boards
- Organize work by project
- Visual task grouping

</td>
</tr>

<tr>
<td width="50%">

### ✅ Task Management
- Create, edit & delete tasks
- Task status tracking
- Priority-based workflow
- Clean Kanban-style layout

</td>
<td width="50%">

### 📅 Productivity Tools
- Calendar view
- Board view for tasks
- Smooth drag & interaction flow

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

### ⚙️ Backend
<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />

- Node.js
- Express.js
- MongoDB
- REST APIs

### 🧰 Tools
<img src="https://skillicons.dev/icons?i=git,github" />

- Git & GitHub

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
│   │   │   └── TaskCard.jsx
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
│
├── .env
└── README.md
```
---

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

