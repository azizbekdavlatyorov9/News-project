const express = require("express");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ` + process.env.PORT); 
} )

