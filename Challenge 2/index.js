import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import connectDB from './db/connectDB.js';
import recipeRoutes from './routes/recipe.route.js';
import IngredientsRoutes from './routes/ingredients.route.js';
import router from './routes/chatbot.route.js';



//sample data for testing
/*
{
  "ingredients": [
    {
      "name": "Flour",
      "quantity": "2 cups"
    },
    {
      "name": "Sugar",
      "quantity": "1.5 cups"
    },
    {
      "name": "Milk",
      "quantity": "500 ml"
    }
  ]
}*/






// Initialize the app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
//routes
app.use('/api/ingredients', IngredientsRoutes);

// Routes
app.use("/api/recipes", recipeRoutes);

app.use("/api/chatbot", router);


// define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes." });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});