# 📝 Note Taker - Full Stack Web Application

A modern, responsive note-taking application built with React, TypeScript, Node.js, and MongoDB. Features include user authentication with email OTP and Google OAuth, complete CRUD operations for notes, and a beautiful UI based on Figma designs.

## 🌟 Live Demo

- **Frontend**: [https://note-taking-amber.vercel.app](https://note-taking-amber.vercel.app)
- **Backend API**: [https://note-taking-uzn5.onrender.com](https://note-taking-uzn5.onrender.com)

## ✨ Features

### 🔐 Authentication System
- **Email OTP Authentication**: Secure signup/signin with email verification
- **Google OAuth Integration**: One-click login with Google
- **JWT Token Management**: Secure token-based authentication
- **Session Persistence**: Stay logged in across browser sessions

### 📱 Note Management
- **Create Notes**: Add new notes with title and content
- **Read Notes**: View all your notes in a beautiful grid layout
- **Edit Notes**: Update existing notes with inline editing
- **Delete Notes**: Remove notes with confirmation dialogs
- **Form Validation**: Real-time validation with error messages

### 🎨 User Interface
- **Figma-Based Design**: Modern, clean UI based on professional designs
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Blue Gradient Theme**: Beautiful blue color scheme throughout
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Smooth loading indicators for all operations

### 🛡️ Error Handling
- **Custom Error Classes**: Professional error handling with proper HTTP status codes
- **User-Friendly Messages**: Clear, actionable error messages
- **Comprehensive Logging**: Server-side logging with Morgan
- **Graceful Failures**: Proper fallbacks for all error scenarios

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - Caching and session storage
- **JWT** - JSON Web Token authentication
- **Nodemailer** - Email service for OTP

### External Services
- **MongoDB Atlas** - Cloud database hosting
- **Redis Cloud** - Managed Redis service
- **Google OAuth** - Authentication provider
- **Gmail SMTP** - Email delivery service

### Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **Render** - Backend hosting with auto-scaling

## 📁 Project Structure

```
note-taker/
├── client/                 # Frontend React application
│   ├── public/
│   │   ├── _redirects     # Vercel SPA routing configuration
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable React components
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── GoogleLoginButton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── otpForm.tsx
│   │   │   └── Toast.tsx
│   │   ├── context/       # React Context providers
│   │   │   └── ToastContext.tsx
│   │   ├── pages/         # Main application pages
│   │   │   ├── AuthCallback.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Signin.tsx
│   │   │   └── Signup.tsx
│   │   ├── routes/        # Route protection
│   │   │   └── ProtectedRoute.tsx
│   │   ├── utils/         # Utility functions
│   │   │   ├── api.ts     # Axios configuration
│   │   │   ├── auth.ts    # Authentication helpers
│   │   │   └── validation.ts
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Application entry point
│   ├── vercel.json        # Vercel deployment configuration
│   └── package.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controller/    # Route controllers
│   │   │   ├── authController.ts
│   │   │   └── noteController.ts
│   │   ├── db/           # Database configuration
│   │   │   └── mongodb.ts
│   │   ├── middleware/   # Express middleware
│   │   │   └── auth.ts
│   │   ├── models/       # Mongoose models
│   │   │   ├── Note.ts
│   │   │   └── User.ts
│   │   ├── routes/       # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── noteRoutes.ts
│   │   ├── services/     # Business logic
│   │   │   ├── authService.ts
│   │   │   └── noteService.ts
│   │   ├── utils/        # Utility functions
│   │   │   ├── errors.ts
│   │   │   ├── jwt.ts
│   │   │   ├── mailer.ts
│   │   │   └── otpRedis.ts
│   │   └── app.ts        # Express app configuration
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Gmail account for email service
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CHARANCHERRY123456/note-taking.git
cd note-taking
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Set up environment variables**

**Backend (.env in server directory):**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/notetaker
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_gmail_app_password
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

**Frontend (.env in client directory):**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Start the development servers**
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with email
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/signin` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note

## 🔧 Development Workflow

### Frontend Development
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd server
npm run dev          # Start with ts-node
npm run build        # Compile TypeScript
npm start           # Run compiled JavaScript
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set root directory to `client`
4. Configure environment variables
5. Deploy automatically on push

### Backend (Render)
1. Connect GitHub repository
2. Set root directory to `server`
3. Configure build and start commands
4. Set environment variables
5. Deploy with auto-scaling

## 🛠️ Key Implementation Details

### Authentication Flow
1. **Email OTP**: Generate 6-digit OTP → Store in Redis → Send via email → Verify → Create JWT
2. **Google OAuth**: Redirect to Google → Callback with code → Verify with Google → Create/login user → JWT

### Note Management
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Real-time Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages and status codes

### Security Features
- **JWT Tokens**: Secure authentication with expiration
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Sanitization and validation of all inputs

### Performance Optimizations
- **Redis Caching**: Fast OTP storage and retrieval
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Vite for fast frontend builds
- **MongoDB Indexing**: Efficient database queries

## 🎨 Design Implementation

### Figma Integration
- **Color Scheme**: Blue gradient theme (#3B82F6 to #1E40AF)
- **Typography**: Clean, modern font stack
- **Spacing**: Consistent padding and margins
- **Responsive Design**: Mobile-first approach

### UI Components
- **Reusable Components**: Modular design system
- **Loading States**: Smooth user feedback
- **Error States**: Clear error messaging
- **Toast Notifications**: Non-intrusive feedback

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Type safety throughout the application
- **ESLint**: Code linting and formatting
- **Error Boundaries**: Graceful error handling
- **Logging**: Comprehensive server-side logging

### Best Practices
- **Component Architecture**: Reusable, maintainable components
- **State Management**: React Context for global state
- **API Design**: RESTful endpoints with proper status codes
- **Security**: JWT tokens, input validation, CORS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Charan Cherry**
- GitHub: [@CHARANCHERRY123456](https://github.com/CHARANCHERRY123456)
- Email: pycharan01@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vercel for seamless deployment
- MongoDB Atlas for reliable database hosting
- Tailwind CSS for beautiful styling
- All the open-source contributors

---

⭐ **Star this repository if you found it helpful!**
