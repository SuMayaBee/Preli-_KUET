import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: String, required: true }, // Quantity as a string (e.g., "2 cups", "500 ml")
        },
    ],
    lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Ingredient", ingredientSchema);