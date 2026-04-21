require('dotenv').config();
require('./config/passport');
require('./config/dbConfig');

const express = require('express');
const cors = require('cors');
const passport = require('passport')
const path = require('path')
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
});

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/files', express.static(path.join(__dirname, 'uploads/files')));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());



// ✅ Map pour stocker les users connectés : { userId -> socketId }
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log('user is connected: ' + socket.id);

    // 1️⃣ Le client envoie son userId dès qu'il se connecte
    socket.on("user:online", (userId) => {
        onlineUsers.set(userId, socket.id);
        // 2️⃣ On broadcast à tout le monde la liste des users en ligne
        io.emit("users:online", Array.from(onlineUsers.keys()));
        console.log("Online users:", Array.from(onlineUsers.keys()));
    });

    // 3️⃣ Rejoindre une room de conversation (pour recevoir les messages)
    socket.on("conversation:join", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    // 4️⃣ Quitter une room
    socket.on("conversation:leave", (conversationId) => {
        socket.leave(conversationId);
    });

    // 5️⃣ Envoyer un message via socket
    socket.on("message:send", (message) => {
        // On envoie à tous dans la room SAUF l'expéditeur
        socket.to(message.conversationId).emit("message:receive", message);
    });

    // 6️⃣ Marquer comme lu — notifier l'autre utilisateur
    socket.on("message:seen", ({ conversationId, userId }) => {
        // On envoie à toute la room que les messages ont été lus par userId
        socket.to(conversationId).emit("message:seen:update", { conversationId, userId });
    });

    // 7️⃣ Déconnexion
    socket.on("disconnect", () => {
        // Supprimer le user de la map
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        // Broadcaster la nouvelle liste
        io.emit("users:online", Array.from(onlineUsers.keys()));
        console.log("User disconnected:", socket.id);
    });
});




const authRouter = require('./routes/AuthRoute');
const userRouter = require('./routes/UserRoute');
const coursRouter = require('./routes/CoursRoute');
const videosRouter = require('./routes/VideosRoute');
const quizRouter = require('./routes/QuizRoute');
const messageRouter = require('./routes/MessageRoute');
const professeurRouter = require('./routes/ProfesseurRoute');
const adminRouter = require('./routes/AdminRoute');

app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/cours',coursRouter);
app.use('/videos',videosRouter);
app.use('/quiz',quizRouter);
app.use('/chat',messageRouter);
app.use('/prof',professeurRouter);
app.use('/admin',adminRouter);

const port = process.env.PORT;
httpServer.listen(port,()=>{
    console.log(`Server + Socket is listening on PORT ${port}`);
});