# Chat Application

This is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. It features user authentication, private messaging, and online status indicators.

## Features

- User registration and login
- Real-time private messaging
- See which users are online
- View user profiles

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: For state management.
- **React Router**: For client-side routing.
- **Socket.IO Client**: For real-time communication.
- **Tailwind CSS**: For styling.
- **Axios**: For making HTTP requests.
- **React Hot Toast**: For displaying notifications.

### Backend

- **Node.js**: A JavaScript runtime environment.
- **Express.js**: A web framework for Node.js.
- **MongoDB**: A NoSQL database.
- **Mongoose**: An ODM for MongoDB.
- **Socket.IO**: For real-time communication.
- **JSON Web Token (JWT)**: For authentication.
- **bcryptjs**: For password hashing.
- **Cors**: For enabling Cross-Origin Resource Sharing.
- **Dotenv**: For managing environment variables.
- **Morgan**: For logging HTTP requests.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kirmadashukla/Pumpkin-task.git
cd Pumpkin-task
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```
PORT=8080
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
COOKIE_EXPIRE='1'
JWT_EXPIRE='1d'
```

Start the backend server:

```bash
npm run dev
```

The backend will be running on `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`.

## How to Use

1.  **Register a new account**: Open your browser to `http://localhost:5173/signup` and create a new account.
2.  **Login**: After registration, you will be redirected to the login page. Log in with your new credentials.
3.  **Chat**: Once logged in, you will see a list of other registered users. Click on a user to start a chat.
4.  **View Profile**: Click on the chat header of an active chat to view the user's profile.
5.  **Logout**: Click the logout button to end your session.

---
