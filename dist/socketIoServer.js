"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = void 0;
const socket_io_1 = require("socket.io");
const socketServer = (server) => {
    // Set up the Socket.IO server
    const io = new socket_io_1.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: [
                "https://trave-news.vercel.app",
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const connectedUsers = [];
    // Handle new socket connection
    io.on("connection", (socket) => {
        console.log(`Connected to socket.io: ${socket.id}`);
        // Setup user when connected
        socket.on("setup", (userData) => {
            if (userData && userData._id) {
                // Add user to the connected list
                connectedUsers.push({ socketId: socket.id, userId: userData._id });
                socket.join(userData._id);
                console.log("User ID connected:", userData._id);
                socket.emit("connected");
                // Notify all users about online users
                io.emit("online users", connectedUsers.map((user) => user.userId));
            }
            else {
                console.log("No user ID provided!");
            }
        });
        // Join user to a chat room
        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User Joined Room:", room);
        });
        // Typing event
        socket.on("typing", (room) => {
            socket.in(room).emit("typing");
        });
        // Stop typing event
        socket.on("stop typing", (room) => {
            socket.in(room).emit("stop typing");
        });
        // Handle new message event
        socket.on("new message", (newMessageReceived) => {
            console.log("newMessageReceived", newMessageReceived);
            const chat = newMessageReceived.chat;
            if (!chat || !chat.users) {
                return console.log("chat.users not defined");
            }
            // Broadcast the message to all users in the chat, except the sender
            chat.users.forEach((user) => {
                if (user._id === newMessageReceived.sender._id)
                    return;
                socket.in(user._id).emit("message received", newMessageReceived);
            });
        });
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("USER DISCONNECTED");
            // Remove user from the connected list
            const index = connectedUsers.findIndex((user) => user.socketId === socket.id);
            if (index !== -1) {
                const disconnectedUser = connectedUsers[index];
                connectedUsers.splice(index, 1);
                console.log("User disconnected:", disconnectedUser.userId);
                // Notify all users about online users
                io.emit("online users", connectedUsers.map((user) => user.userId));
            }
        });
        // Handle setup cleanup (optional)
        socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave([...socket.rooms][0]);
        });
    });
};
exports.socketServer = socketServer;
