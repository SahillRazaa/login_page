const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const cors = require("cors");
const userRoute = require("./userRoute");

const PORT = process.env.PORT || 3000; 
const uri = process.env.MONGO_URL;

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to the database');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

connectToMongoDB();

app.use(cors());

//for testing server
app.get("/", (req, res) => {
    res.send("Welcome to the API server!");
});

app.use(express.json());
app.use("/api/user", userRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
