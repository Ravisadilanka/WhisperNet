const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoute');
const socket = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    exposedHeaders: ['x-auth-token'],
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Socket.IO setup
const io = socket(server, {
    cors: {
        origin: ["http://localhost:5000", "http://localhost:3000"],
        credentials: true,
    },
});

// Online users map
global.onlineUsers = new Map();

// Socket.IO connection handler
io.on("connection", (socket) => {
    global.chatSocket = socket;

    // Handle user connection
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} connected`);
    });

    // Handle sending messages
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        } else {
            console.error("User socket not found for user:", data.to);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        // Remove user from onlineUsers map
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});