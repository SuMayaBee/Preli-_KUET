import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: String }, // Optional for parsing recipes
        },
    ],
    steps: { type: String, required: true },
    taste: { type: String }, // e.g., "Sweet", "Savory"
    reviews: [{ user: String, comment: String, rating: Number }], // Array of reviews
    cuisine: { type: String }, // e.g., "Italian", "Indian"
    preparationTime: { type: Number }, // Time in minutes
    addedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recipe", recipeSchema);
