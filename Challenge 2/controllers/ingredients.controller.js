import Ingredient from "../models/ingredients.model.js"; // Ensure this is imported only once

/**
 * Add multiple ingredients
 */
export const addIngredients = async (req, res) => {
    try {
        const { ingredients } = req.body; // ingredients is an array of objects with { name, quantity }

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ message: "Ingredients must be an array." });
        }

        // Iterate through the array of ingredients to either add or update them
        for (let ingredientData of ingredients) {
            const { name, quantity } = ingredientData;

            // Check if both name and quantity are provided
            if (!name || !quantity) {
                return res.status(400).json({ message: "Each ingredient must have a name and quantity." });
            }

            // Find the ingredient by name (if already exists)
            const existingIngredient = await Ingredient.findOne({ "ingredients.name": name });

            if (existingIngredient) {
                // If the ingredient exists, update the quantity of the matching ingredient
                const ingredientIndex = existingIngredient.ingredients.findIndex(
                    (ingredient) => ingredient.name === name
                );

                if (ingredientIndex !== -1) {
                    // Update the quantity of the existing ingredient (as a string)
                    existingIngredient.ingredients[ingredientIndex].quantity = quantity;
                    existingIngredient.lastUpdated = Date.now();
                    await existingIngredient.save();
                }
            } else {
                // If the ingredient doesn't exist, create it
                const newIngredient = new Ingredient({
                    ingredients: [{ name, quantity }],
                });
                await newIngredient.save();
            }
        }

        res.status(201).json({ message: "Ingredients added or updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update the quantity of an existing ingredient
 */
export const updateIngredients = async (req, res) => {
    try {
        const { ingredients } = req.body; // ingredients is an array of objects with { name, quantity }

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ message: "Ingredients must be an array." });
        }

        for (let ingredientData of ingredients) {
            const { name, quantity } = ingredientData;

            if (!name || !quantity) {
                return res.status(400).json({ message: "Each ingredient must have a name and quantity." });
            }

            // Find the ingredient by name
            const existingIngredient = await Ingredient.findOne({ "ingredients.name": name });

            if (existingIngredient) {
                // If the ingredient exists, update the quantity of the matching ingredient
                const ingredientIndex = existingIngredient.ingredients.findIndex(
                    (ingredient) => ingredient.name === name
                );

                if (ingredientIndex !== -1) {
                    // Update the quantity of the existing ingredient
                    existingIngredient.ingredients[ingredientIndex].quantity = quantity;
                    existingIngredient.lastUpdated = Date.now();
                    await existingIngredient.save();
                }
            } else {
                return res.status(404).json({ message: `Ingredient ${name} not found.` });
            }
        }

        res.status(200).json({ message: "Ingredients updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all ingredients
 */
export const getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete an ingredient
 */
export const deleteIngredient = async (req, res) => {
    try {
        const { name } = req.body; // Ingredient name to delete

        if (!name) {
            return res.status(400).json({ message: "Ingredient name is required to delete." });
        }

        // Find the ingredient by name within the ingredients array
        const ingredient = await Ingredient.findOne({ "ingredients.name": name });

        if (!ingredient) {
            return res.status(404).json({ message: "Ingredient not found." });
        }

        // Find the index of the ingredient to be removed in the ingredients array
        const ingredientIndex = ingredient.ingredients.findIndex((ing) => ing.name === name);

        if (ingredientIndex !== -1) {
            // Remove the ingredient from the ingredients array
            ingredient.ingredients.splice(ingredientIndex, 1);
            ingredient.lastUpdated = Date.now(); // Update the lastUpdated field
            await ingredient.save(); // Save the updated ingredient document

            res.json({ message: `${name} removed successfully.` });
        } else {
            res.status(404).json({ message: "Ingredient not found in the list." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};