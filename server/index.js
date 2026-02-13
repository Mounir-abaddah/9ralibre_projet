require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport')
const path = require('path')
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");


require('./config/passport')

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

require('./config/dbConfig');

const authRouter = require('./routes/AuthRoute');
const userRouter = require('./routes/UserRoute');
const coursRouter = require('./routes/CoursRoute');
const videosRouter = require('./routes/VideosRoute');
const quizRouter = require('./routes/QuizRoute');
const messagerieRouter = require('./routes/MessagerieRoute')

app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/cours',coursRouter);
app.use('/videos',videosRouter)
app.use('/quiz',quizRouter);
app.use('/messagerie',messagerieRouter);


const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors:({
        origin:process.env.FRONTEND_URL,
        credentials:true
    })
})


io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté : ", socket.id);

    socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} rejoint room ${conversationId}`);
    });

    socket.on("sendMessage", ({ conversationId, message }) => {
        socket.to(conversationId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté : ", socket.id);
    });
});

const port = process.env.PORT;
httpServer.listen(port,()=>{
    console.log(`Server is listening on PORT ${port}`);
})