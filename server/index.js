const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json())

require('./config/dbConfig');

const authRouter = require('./routes/AuthRoute');
app.use('/auth',authRouter)

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is listening on PORT ${port}`);
})