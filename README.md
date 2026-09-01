# TaskPlanet Mini - Social Media App

## Overview
A full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). Users can create posts (text, images, videos), like/comment/share, follow other users, send direct messages, and search for users and posts. Features a modern, polished UI with Material Design components, gradient styling, and smooth interactions.

## Tech Stack
- **Frontend:** React 18 + Vite + Material UI (MUI 5)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (cloud)
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **HTTP Client:** Axios
- **Routing:** React Router DOM v6

## Project Structure
```
taskplanet-mini/
├── backend/                         # Backend (Node.js + Express)
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, GetMe
│   │   ├── postController.js        # CRUD for posts, like, comment, share, search
│   │   ├── userController.js        # Profile, follow/unfollow, search
│   │   └── messageController.js     # Send/get messages, conversations
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── models/
│   │   ├── User.js                  # User schema (username, email, password, followers, following)
│   │   ├── Post.js                  # Post schema (content, media, likes, comments, shares)
│   │   └── Message.js               # Message schema (sender, receiver, text, read)
│   ├── routes/
│   │   ├── auth.js                  # /api/auth/*
│   │   ├── posts.js                 # /api/posts/*
│   │   ├── users.js                 # /api/users/*
│   │   └── messages.js              # /api/messages/*
│   ├── uploads/                     # Stored media files
│   ├── .env                         # Environment variables (MongoDB URI, JWT secret, port)
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── frontend/                        # Frontend (React + Vite)
│   └── src/
│       ├── components/
│       │   ├── Layout.jsx           # App shell with AppBar, Search, BottomNavigation
│       │   └── SearchDialog.jsx     # Full-screen search overlay (users + posts)
│       ├── pages/
│       │   ├── Login.jsx            # Login form with gradient styling
│       │   ├── Register.jsx         # Registration form with gradient styling
│       │   ├── Feed.jsx             # Post creation + feed with filter chips + FAB
│       │   ├── Profile.jsx          # User profile with gradient header + badges
│       │   └── Messages.jsx         # Chat list + direct messaging with styled bubbles
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state (user, login, register, logout)
│       ├── services/
│       │   └── api.js               # Axios instance + all API calls
│       ├── App.jsx                  # Route definitions + MUI theme
│       └── main.jsx                 # React root mount
│
└── README.md
```

## Features
- **Authentication:** Register with username/email/password. Login with auto-account creation if email not found.
- **Post Creation:** Create posts with text, images, or videos via file upload. Toggle tabs for All Posts / Promotions.
- **Feed Filters:** Horizontal scrollable filter chips (All Post, For You, Most Liked, Most Commented).
- **Like/Comment/Share:** Interactive post actions with like toggle, inline comments, and share counter.
- **User Profiles:** Gradient header, avatar ring, follower/following/post count badges, Follow/Unfollow, Message button.
- **Direct Messaging:** Styled chat bubbles with sender alignment, timestamps, online status indicator.
- **Search:** Full-screen search dialog accessible from AppBar. Search both users (by username) and posts (by content) with debounced real-time results.
- **Modern UI:** Custom MUI theme with bright blue primary, gradient buttons, rounded corners, card shadows, hover effects.
- **Floating Action Button:** Quick post creation via FAB in feed view.
- **Bottom Navigation:** Blue gradient bottom nav with raised center social button.

## UI Improvements (v2.0)
- **Theme:** Custom MUI theme with bright blue (#2196F3) primary, orange secondary, 16px border radius, custom component overrides for Card, Button, TextField, Chip, Avatar, Dialog.
- **Login/Register:** Full-viewport gradient background, centered white card with rounded corners, gradient submit button.
- **AppBar:** White background with gradient text logo, search icon button, avatar with border ring.
- **Bottom Nav:** Blue gradient background, white icons, raised center FAB-style social button.
- **Feed:** Create post card with expandable input, media icons, filter chips, FAB for quick posting.
- **Post Cards:** Rounded avatars with borders, Follow badges, hover elevation effects, styled action bar.
- **Profile:** Gradient header banner, large avatar with shadow, stat badges (followers/following/posts).
- **Messages:** Styled chat bubbles (rounded corners, blue sent / white received), online status dots, empty state illustration.
- **Search Dialog:** Full-screen overlay with tabbed results (Users/Posts), debounced input, loading states, result counts.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free tier)

### 1. Clone / Navigate to Project
```bash
cd C:\c++\taskplanet-mini
```

### 2. Configure Environment Variables
Edit `backend/.env`:
```
PORT=5001
MONGODB_URI=mongodb+srv://Thunder:2412@task-planet.hvcyzt0.mongodb.net/taskplanet-mini?retryWrites=true&w=majority
JWT_SECRET=taskplanet_mini_secret_key_2024
```

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Start the App
Open two terminals:
```bash
# Terminal 1 - Backend
cd C:\c++\taskplanet-mini\backend
npm run dev

# Terminal 2 - Frontend
cd C:\c++\taskplanet-mini\frontend
npm run dev
```

### 5. Open Browser
Go to `http://localhost:3000`

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/register` | `{ username, email, password }` | Register new user |
| POST | `/login` | `{ email, password }` | Login (auto-creates user if not found) |
| GET | `/me` | - | Get current logged-in user |

### Posts (`/api/posts`)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/search?q=` | - | Search posts by content |
| POST | `/` | `FormData: content, media` | Create post (text + optional image/video) |
| GET | `/` | - | Get all posts (feed) |
| POST | `/:id/like` | - | Toggle like on post |
| POST | `/:id/comment` | `{ text }` | Add comment to post |
| POST | `/:id/share` | - | Increment share count |
| DELETE | `/:id` | - | Delete own post |

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=` | Search users by username |
| GET | `/:id` | Get user profile with followers/following |
| POST | `/:id/follow` | Toggle follow/unfollow |

### Messages (`/api/messages`)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/` | `{ receiverId, text }` | Send a message |
| GET | `/conversations` | - | Get all conversations with last message |
| GET | `/:userId` | - | Get full chat history with a user |

## Database Schemas

### User
```js
{
  username: String (unique, required),
  email: String (unique, required, lowercase),
  password: String (hashed with bcrypt),
  avatar: String (default: ''),
  bio: String (max 200 chars),
  followers: [ObjectId ref User],
  following: [ObjectId ref User],
  timestamps: true
}
```

### Post
```js
{
  user: ObjectId ref User (required),
  content: String,
  media: String (file path),
  mediaType: 'image' | 'video' | '',
  likes: [ObjectId ref User],
  comments: [{ user: ObjectId ref User, text: String, timestamps }],
  shares: Number (default: 0),
  timestamps: true
}
```

### Message
```js
{
  sender: ObjectId ref User (required),
  receiver: ObjectId ref User (required),
  text: String (required),
  read: Boolean (default: false),
  timestamps: true
}
```

## Key Implementation Details

- **DNS Fix:** Added `dns.setServers(['8.8.8.8', '8.8.4.4'])` in `server.js` to resolve MongoDB Atlas SRV records (local DNS was blocking resolution).
- **Port Change:** Server runs on port 5001 because port 5000 was occupied by Intel Graphics Command Center service.
- **Auto Account Creation:** Login auto-creates a user if the email doesn't exist (username extracted from email prefix).
- **File Uploads:** Multer handles image/video uploads, stored in `backend/uploads/`, served statically.
- **JWT Auth:** Token stored in localStorage, sent via `Authorization: Bearer <token>` header.
- **Vite Proxy:** Frontend dev server proxies `/api` and `/uploads` requests to the backend.
- **Search:** Debounced (300ms) search dialog with parallel API calls for users and posts. MongoDB regex search on username and post content fields.
- **Custom MUI Theme:** Centralized theme in `App.jsx` with component overrides for consistent styling across all pages.
