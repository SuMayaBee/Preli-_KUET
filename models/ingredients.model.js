import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
