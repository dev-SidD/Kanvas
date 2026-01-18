# Kanvas - Project Management Kanban Board

A modern, real-time Kanban-style project management application built with React and Node.js. Kanvas allows teams to collaborate effectively with workspaces, boards, lists, and cards with real-time updates and notifications.

![Kanvas Logo](./client/public/vite.svg)

## 🚀 Features

- **Real-time Collaboration**: Live updates using Socket.IO for seamless team collaboration
- **Workspace Management**: Organize projects into workspaces with role-based access control
- **Kanban Boards**: Create and manage boards with customizable lists and cards
- **Task Management**: Assign tasks, set due dates, add checklists, and track progress
- **Comments & Mentions**: Collaborate with team members using comments and @mentions
- **Notifications**: Stay updated with real-time notifications for assignments and mentions
- **User Authentication**: Secure JWT-based authentication with email verification
- **Responsive Design**: Modern, intuitive UI that works on all devices

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **SendGrid/Nodemailer** - Email services

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🏃‍♂️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/kanvas.git
cd kanvas
```

### 2. Environment Setup
Create environment files in both client and server directories:

#### Backend (.env in server/)
```env
# Database
MONGO_URI=mongodb://localhost:27017/kanvas

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Optional - for email verification)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@kanvas.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
```

#### Frontend (.env in client/)
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# Or use MongoDB Atlas for cloud database
```

### 5. Start the Application

#### Backend (Terminal 1)
```bash
cd server
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📖 Usage

### Getting Started
1. **Register**: Create a new account or login with existing credentials
2. **Create Workspace**: Set up your first workspace for project organization
3. **Create Board**: Add a new Kanban board to your workspace
4. **Add Lists**: Create columns like "To Do", "In Progress", "Done"
5. **Create Cards**: Add tasks as cards to your lists
6. **Collaborate**: Assign team members, add comments, and track progress

### Key Features Guide

#### Workspace Management
- Create multiple workspaces for different projects or teams
- Invite members with different roles (admin/member)
- Control access at the workspace level

#### Board Operations
- Drag and drop cards between lists
- Real-time updates for all team members
- Archive completed boards

#### Card Management
- Add descriptions, due dates, and labels
- Assign multiple team members to tasks
- Create checklists for task breakdown
- Add comments and @mention team members

#### Notifications
- Get notified when assigned to tasks
- Real-time alerts for mentions in comments
- Track all notifications in your dashboard

## 🔌 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/user - Get logged-in user data
POST /api/auth/verify-email - Email verification
```

### Workspace Endpoints
```
POST /api/workspaces - Create workspace
GET /api/workspaces - Get user's workspaces
GET /api/workspaces/:id - Get workspace by ID
PUT /api/workspaces/:id - Update workspace
DELETE /api/workspaces/:id - Delete workspace
POST /api/workspaces/:id/members - Add member to workspace
```

### Board Endpoints
```
POST /api/boards - Create board
GET /api/workspaces/:workspaceId/boards - Get boards by workspace
GET /api/boards/:boardId - Get board with populated data
PUT /api/boards/:boardId - Update board
DELETE /api/boards/:boardId - Delete board
```

### List Endpoints
```
POST /api/lists - Create list
GET /api/lists/:listId - Get list by ID
PUT /api/lists/:listId - Update list
DELETE /api/lists/:listId - Delete list
PUT /api/lists/:listId/move - Move list position
```

### Card Endpoints
```
POST /api/cards - Create card
GET /api/cards/board/:boardId - Get cards by board
GET /api/cards/:cardId - Get card by ID
PUT /api/cards/:cardId - Update card
PUT /api/cards/move/:cardId - Move card between lists
DELETE /api/cards/:cardId - Delete card
```

### Additional Endpoints
```
GET /api/notifications - Get user notifications
PUT /api/notifications/:id/read - Mark notification as read
POST /api/cards/:cardId/comments - Add comment
GET /api/cards/:cardId/comments - Get card comments
```

## 🔧 Development

### Project Structure
```
kanvas/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── routing/        # Route components
│   │   └── services/       # API service functions
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
└── README.md
```

### Available Scripts

#### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Server
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Testing
```bash
# Add tests in the future
npm test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, Node.js, and MongoDB
- Real-time features powered by Socket.IO
- Email services by SendGrid
- Icons and UI inspiration from modern design systems

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Happy project managing with Kanvas! 🎯**