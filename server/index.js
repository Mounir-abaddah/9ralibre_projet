const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());

require('./config/dbConfig')

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is listening on PORT ${port}`);
})