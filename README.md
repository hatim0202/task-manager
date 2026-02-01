# 🚀 Task Manager Application

A beautiful, full-stack Task Management Web Application built with modern technologies. Features JWT authentication, CRUD operations, and a stunning responsive UI with glassmorphism effects.

![Task Manager](https://img.shields.io/badge/Task-Manager-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### Core Functionality
- ✅ **Create, Read, Update, Delete** tasks
- ✅ **Task Status Management** (Pending, In Progress, Completed)
- ✅ **Filter tasks** by status
- ✅ **Search** tasks by title/description
- ✅ **Pagination** for large task lists

### Authentication
- 🔐 **JWT-based Authentication**
- 📝 **User Registration**
- 🔑 **User Login/Logout**
- 👤 **Protected Routes**

### UI/UX
- 🎨 **Modern Glassmorphism Design**
- 📱 **Fully Responsive** (Mobile, Tablet, Desktop)
- ✨ **Smooth Animations & Transitions**
- 🏠 **Beautiful Hero Section**
- 📊 **Task Statistics Dashboard**

### Backend
- 🌐 **RESTful API Architecture**
- ✅ **Input Validation**
- 🚨 **Centralized Error Handling**
- 📄 **API Documentation**
- 🗄️ **MongoDB Atlas Integration**

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | HTTP Client |
| Context API | State Management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express | Web Framework |
| MongoDB | Database |
| Mongoose | ODM Library |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| express-validator | Input Validation |

---

## 📁 Project Structure

```
task-manager/
├── 📂 backend/                 # Backend API
│   ├── 📂 src/
│   │   ├── 📂 config/         # Database configuration
│   │   │   └── db.js
│   │   ├── 📂 controllers/    # Route controllers
│   │   │   ├── taskController.js
│   │   │   └── authController.js
│   │   ├── 📂 middleware/     # Express middleware
│   │   │   ├── errorMiddleware.js
│   │   │   ├── authMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── 📂 models/         # Mongoose models
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── 📂 routes/         # API routes
│   │   │   ├── taskRoutes.js
│   │   │   └── authRoutes.js
│   │   └── server.js          # Entry point
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   └── package.json
│
├── 📂 frontend/               # React Application
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable components
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx
│   │   ├── 📂 pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── 📂 context/       # React Context
│   │   │   └── TaskContext.jsx
│   │   ├── 📂 services/      # API services
│   │   │   └── api.js
│   │   ├── App.jsx           # Main App
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── 📄 README.md               # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB Atlas Account** (or local MongoDB)
- **Git** for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/hatim0202/task-manager.git

# Navigate to project directory
cd task-manager
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit the `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Server will run at: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Application will run at: `http://localhost:5173`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

---

## 📡 API Endpoints

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?status=pending` | Filter by status |
| GET | `/api/tasks?search=keyword` | Search tasks |
| GET | `/api/tasks?page=1&limit=10` | Paginated results |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats` | Get task statistics |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Request/Response Examples

**Create Task Request:**
```json
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete Project",
  "description": "Finish the task manager project",
  "status": "pending"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "xxxxx",
    "title": "Complete Project",
    "description": "Finish the task manager project",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🎨 UI Features

### Design Elements
- **Glassmorphism**: Frosted glass effects on cards and navbar
- **Gradients**: Beautiful color gradients throughout
- **Animations**: Smooth floating and fade animations
- **Responsive**: Mobile-first design approach

### Components
- 📋 **Task Cards**: Beautiful cards with status indicators
- 🔍 **Search & Filter**: Real-time filtering
- 📝 **Task Form**: Clean form with validation
- 🔔 **Toast Notifications**: User feedback
- 📊 **Statistics**: Task count overview

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Backend (Railway/Render/Heroku)
1. Connect your GitHub repository
2. Set environment variables in deployment dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random string
   - `JWT_EXPIRE`: Token expiration time
   - `PORT`: Port number
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set environment variable:
   - `VITE_API_URL`: Your backend URL

### MongoDB Atlas Setup
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with read/write permissions
3. Add IP address `0.0.0.0/0` to whitelist
4. Get connection string from "Connect" > "Connect your application"
5. Replace in `.env` file

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Vite](https://vitejs.dev/)

---

## 📧 Support

For support, please open an issue in the repository or contact the maintainer.

---

**Made with ❤️ by Your Hatim Mandviwala**
