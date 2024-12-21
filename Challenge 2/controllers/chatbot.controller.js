import Recipe from "../models/recipe.model.js";

import fs from "fs/promises";

// Configure OpenAI API key

import OpenAI from "openai";

const openai = new OpenAI(
    process.env.OPENAI_API_KEY 
);

/**
 * Chatbot endpoint
 */
export const chatbotInteraction = async (req, res) => {
    try {
        const { preferences, availableIngredients } = req.body;

        // Step 1: Fetch all recipes from the database
        const allRecipes = await Recipe.find();

        // Step 2: Filter recipes based on available ingredients
        const filteredRecipes = allRecipes.filter((recipe) => {
            return recipe.ingredients.every((ingredient) => 
                availableIngredients.includes(ingredient.name)
            );
        });

        // Step 3: If filtered recipes exist, prepare response
        if (filteredRecipes.length > 0) {
            const recipeNames = filteredRecipes.map((recipe) => recipe.name).join(", ");

            // Use OpenAI to refine or suggest based on preferences
            const prompt = `You are a helpful assistant. Based on the user's preferences: "${preferences}" and these available recipes: "${recipeNames}", suggest the best options and explain why.`;
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                
                max_tokens: 200,
                messages:[
                    {"role": "developer", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                  ]
            });

            const suggestion = completion.choices[0].text;

            return res.status(200).json({
                message: "Here are some recipe suggestions based on your preferences.",
                suggestion,
                recipes: filteredRecipes,
            });
        }

        // Step 4: If no matching recipes, use OpenAI to suggest alternatives
        const prompt = `User said: "${preferences}". They have these ingredients: "${availableIngredients.join(", ")}". Suggest recipes or ideas they can try.`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            
            max_tokens: 200,
            messages:[
                {"role": "developer", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
              ]
        });

        const alternativeSuggestion = completion.choices[0].text;

        return res.status(200).json({
            message: "No exact recipes found, but here are some ideas.",
            suggestion: alternativeSuggestion,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
