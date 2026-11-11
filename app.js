const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRouter = require("./src/routes/auth.routes");
require("dotenv").config();
const path = require('path')

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(authRouter)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

 
connectDB();
 
  
 

 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
} )

