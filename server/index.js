require('dotenv').config();
require('./config/passport');
require('./config/dbConfig');

const express = require('express');
const cors = require('cors');
const passport = require('passport')
const path = require('path')
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());



const authRouter = require('./routes/AuthRoute');
const userRouter = require('./routes/UserRoute');
const coursRouter = require('./routes/CoursRoute');
const videosRouter = require('./routes/VideosRoute');
const quizRouter = require('./routes/QuizRoute');

app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/cours',coursRouter);
app.use('/videos',videosRouter);
app.use('/quiz',quizRouter);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is listening on PORT ${port}`);
});