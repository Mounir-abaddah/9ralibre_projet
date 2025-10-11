require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport')
const cookieParser = require('cookie-parser');

require('./config/passport')

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));

app.use(express.static('uploads/images'))
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

require('./config/dbConfig');

const authRouter = require('./routes/AuthRoute');
const userRouter = require('./routes/UserRoute');

app.use('/auth',authRouter)
app.use('/user',userRouter)

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is listening on PORT ${port}`);
})