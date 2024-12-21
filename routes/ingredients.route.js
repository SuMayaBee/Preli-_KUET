
import {
    addIngredients,
    updateIngredients,
    getIngredients,
    deleteIngredient,
} from "../controllers/ingredients.controller.js"; // Adjust path as needed

import express from "express";
const router = express.Router();
// Routes
router.post("/", addIngredients); // Add a new ingredient
router.put("/:id", updateIngredients); // Update an ingredient
router.get("/", getIngredients); // Get all ingredients
router.delete("/name", deleteIngredient); // Delete an ingredient

export default router;
