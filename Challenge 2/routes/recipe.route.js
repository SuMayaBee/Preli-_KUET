import express from "express";
import {
    addRecipe,
    parseRecipesFromText,
    parseRecipeFromImage,
    getRecipes,
} from "../controllers/recipe.controller.js";

const router = express.Router();

router.post("/add", addRecipe); // Add a new recipe
router.get("/parse-text", parseRecipesFromText); // Parse recipes from a text file
router.post("/parse-image", parseRecipeFromImage); // Parse recipes from an image using OCR
router.get("/", getRecipes); // Get all recipes

export default router;
