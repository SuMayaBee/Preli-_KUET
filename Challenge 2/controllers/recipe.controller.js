import Recipe from "../models/recipe.model.js";
import fs from "fs/promises";
import tesseract from "tesseract.js";

/**
 * Add a new recipe (text-based)
 */
export const addRecipe = async (req, res) => {
    try {
        const { name, ingredients, steps, taste, reviews, cuisine, preparationTime } = req.body;

        const newRecipe = new Recipe({
            name,
            ingredients,
            steps,
            taste,
            reviews,
            cuisine,
            preparationTime,
        });

        // Save recipe to the database
        await newRecipe.save();

        // Format recipe for text file
        const formattedRecipe = `
${name}:
Ingredients:
${ingredients.map((ing) => `- ${ing.name}: ${ing.quantity || "N/A"}`).join("\n")}
Steps:
${steps}
Taste: ${taste || "N/A"}
Cuisine: ${cuisine || "N/A"}
Preparation Time: ${preparationTime || "N/A"} minutes
Reviews:
${(reviews || []).map((review) => `- ${review.user}: ${review.comment} (${review.rating || 0}/5)`).join("\n") || "No reviews yet"}
`.trim();

        // Read the file content to check for duplicates
        let fileContent = "";
        try {
            fileContent = await fs.readFile("my_fav_recipes.txt", "utf-8");
        } catch {
            await fs.writeFile("my_fav_recipes.txt", ""); // Create the file if it doesn't exist
        }

        // Append the recipe only if it doesn't already exist
        if (!fileContent.includes(formattedRecipe)) {
            await fs.appendFile("my_fav_recipes.txt", `\n\n${formattedRecipe}`);
        }

        res.status(201).json({ message: "Recipe added successfully and written to file." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Parse and save recipe details from a text file
 */
export const parseRecipesFromText = async (req, res) => {
    try {
        const fileContent = await fs.readFile("my_fav_recipes.txt", "utf-8");

        // Split recipes by double newlines
        const recipes = fileContent.trim().split("\n\n").map((recipeBlock) => {
            const lines = recipeBlock.trim().split("\n");

            // Parse recipe name
            const nameLine = lines[0];
            const name = nameLine.endsWith(":") ? nameLine.replace(":", "").trim() : null;
            if (!name) {
                throw new Error("Recipe name is missing or improperly formatted.");
            }

            // Parse ingredients
            const ingredientsIndex = lines.indexOf("Ingredients:");
            const stepsIndex = lines.indexOf("Steps:");
            if (ingredientsIndex === -1 || stepsIndex === -1) {
                throw new Error(`Missing 'Ingredients:' or 'Steps:' section for recipe: ${name}`);
            }

            const ingredients = lines.slice(ingredientsIndex + 1, stepsIndex).map((line) => {
                const [ingredientName, quantity] = line.replace("- ", "").split(":").map((str) => str.trim());
                if (!ingredientName || !quantity) {
                    throw new Error(`Invalid ingredient format in recipe: ${name}`);
                }
                return { name: ingredientName, quantity };
            });

            // Parse steps
            const stepsEndIndex = lines.findIndex((line, index) => index > stepsIndex && line.includes("Taste:"));
            const steps = stepsEndIndex !== -1
                ? lines.slice(stepsIndex + 1, stepsEndIndex).join(" ")
                : lines.slice(stepsIndex + 1).join(" ");

            // Parse optional fields
            const taste = lines.find((line) => line.startsWith("Taste:"))
                ?.replace("Taste:", "").trim();
            const cuisine = lines.find((line) => line.startsWith("Cuisine:"))
                ?.replace("Cuisine:", "").trim();
            const preparationTime = lines.find((line) => line.startsWith("Preparation Time:"))
                ?.replace("Preparation Time:", "").replace("minutes", "").trim();
            const reviewsIndex = lines.findIndex((line) => line.startsWith("Reviews:"));
            const reviews = reviewsIndex !== -1
                ? lines.slice(reviewsIndex + 1).map((line) => {
                    const [userComment, rating] = line.replace("- ", "").split("(");
                    const [user, comment] = userComment.split(":").map((str) => str.trim());
                    const parsedRating = parseFloat(rating?.replace("/5)", "").trim());
                    return { user, comment, rating: parsedRating || 0 };
                })
                : [];

            return { name, ingredients, steps, taste, cuisine, preparationTime: parseInt(preparationTime, 10), reviews };
        });

        // Save parsed recipes to database
        for (const recipe of recipes) {
            await Recipe.create(recipe);
        }

        // Send the parsed recipes in the response
        res.status(200).json({ message: "Recipes parsed and saved successfully.", parsedRecipes: recipes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Parse a recipe from an image using OCR
 */
export const parseRecipeFromImage = async (req, res) => {
    try {
        const { imagePath } = req.body;

        // Use Tesseract.js to recognize text from the image
        const { data } = await tesseract.recognize(imagePath, "eng");
        const parsedText = data.text.trim();

        // Append the parsed text to the text file
        await fs.appendFile("my_fav_recipes.txt", `\n\n${parsedText}`);

        // Parse the recipe text into a structured format
        const lines = parsedText.split("\n").map((line) => line.trim());

        // Parse recipe name
        const nameLine = lines[0];
        const name = nameLine.endsWith(":") ? nameLine.replace(":", "").trim() : null;
        if (!name) {
            throw new Error("Recipe name is missing or improperly formatted.");
        }

        // Parse ingredients
        const ingredientsIndex = lines.indexOf("Ingredients:");
        const stepsIndex = lines.indexOf("Steps:");
        if (ingredientsIndex === -1 || stepsIndex === -1) {
            throw new Error(`Missing 'Ingredients:' or 'Steps:' section for recipe: ${name}`);
        }

        const ingredients = lines.slice(ingredientsIndex + 1, stepsIndex).reduce((acc, line) => {
            const parts = line.replace("- ", "").split(":").map((str) => str.trim());
            if (parts.length === 2) {
                acc.push({ name: parts[0], quantity: parts[1] });
            } else {
                console.warn(`Skipped invalid ingredient line: "${line}"`);
            }
            return acc;
        }, []);

        if (ingredients.length === 0) {
            throw new Error(`No valid ingredients found in recipe: ${name}`);
        }

        // Parse steps
        const stepsEndIndex = lines.findIndex((line, index) => index > stepsIndex && line.includes("Taste:"));
        const steps = stepsEndIndex !== -1
            ? lines.slice(stepsIndex + 1, stepsEndIndex).join(" ")
            : lines.slice(stepsIndex + 1).join(" ");

        // Parse optional fields
        const taste = lines.find((line) => line.startsWith("Taste:"))
            ?.replace("Taste:", "").trim();
        const cuisine = lines.find((line) => line.startsWith("Cuisine:"))
            ?.replace("Cuisine:", "").trim();
        const preparationTime = lines.find((line) => line.startsWith("Preparation Time:"))
            ?.replace("Preparation Time:", "").replace("minutes", "").trim();
        const reviewsIndex = lines.findIndex((line) => line.startsWith("Reviews:"));
        const reviews = reviewsIndex !== -1
            ? lines.slice(reviewsIndex + 1).map((line) => {
                const [userComment, rating] = line.replace("- ", "").split("(");
                const [user, comment] = userComment.split(":").map((str) => str.trim());
                const parsedRating = parseFloat(rating?.replace("/5)", "").trim());
                return { user, comment, rating: parsedRating || 0 };
            })
            : [];

        // Format the parsed recipe into a structured object
        const parsedRecipe = {
            name,
            ingredients,
            steps,
            taste,
            cuisine,
            preparationTime: parseInt(preparationTime, 10),
            reviews,
        };

        // Save parsed recipe to the database
        await Recipe.create(parsedRecipe);

        // Respond with the parsed recipe
        res.status(200).json({
            message: "Recipe parsed and saved to file and database successfully.",
            parsedRecipe,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



/**
 * Get all recipes
 */
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
