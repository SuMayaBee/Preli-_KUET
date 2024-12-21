import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import connectDB from './db/connectDB.js';


// Initialize the app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});