# Challenge 1: Banglish-to-Bengali Transliteration

This challenge aims to build a machine learning model to transliterate Banglish (Bengali written in English letters) into proper Bengali script. The solution leverages Hugging Face's `MT5` model, fine-tuned on a Banglish-to-Bengali dataset.

---

## **Approach**

### **1. Model Selection**
- **Model Used**: `MT5 (Multilingual T5)`
  - Selected for its ability to handle multilingual tasks and low-resource language datasets.

### **2. Dataset Preparation**
- **Dataset**: Used the Banglish-to-Bengali transliteration dataset.
- **Splitting**:
  - Training Set: 80%
  - Validation Set: 20%
- **Preprocessing**:
  - Tokenized both Banglish and Bengali text using Hugging Face's `T5Tokenizer`.
  - Applied padding and truncation with a maximum sequence length of `128`.

### **3. Training**
- **Framework**: Hugging Face's `Trainer` API.
- **Training Arguments**:
  - `learning_rate`: `5e-5`
  - `batch_size`: `4`
  - `num_train_epochs`: `3`
  - `evaluation_strategy`: `epoch` (evaluates the model after each epoch)
  - `save_strategy`: `epoch` (saves the model checkpoint after each epoch)
  - `logging_dir`: Logs directory for training metrics.
- **Loss Function**: The model computes cross-entropy loss for sequence generation.

---

## **How to Use the Model**

### **1. Prerequisites**
Install the required library:
```bash
pip install transformers
```

### 2. Load the Model

The trained model is stored locally in the `Model` directory. Load it using the following code:

```python
from transformers import MT5ForConditionalGeneration, T5Tokenizer

# Specify the path to the local model directory
model_path = "./Model"

# Load the tokenizer and model
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = MT5ForConditionalGeneration.from_pretrained(model_path)

```

### 3. Generate Predictions

Use the model to translate Banglish text to Bengali:

```python
def translate_banglish_to_bengali(banglish_text):
    # Tokenize the input
    inputs = tokenizer(banglish_text, return_tensors="pt", max_length=128, truncation=True)

    # Generate output
    outputs = model.generate(**inputs)

    # Decode the output
    bengali_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return bengali_text

# Example usage
banglish_text = "ami bhalo achi"
bengali_output = translate_banglish_to_bengali(banglish_text)

print(f"Banglish Input: {banglish_text}")
print(f"Bengali Output: {bengali_output}")
```

### 4. Expected Output

For the input `ami bhalo achi`, the output will be:

```text
Banglish Input: ami bhalo achi
Bengali Output: আমি ভালো আছি
```

### Saving the Model

If needed, the model and tokenizer can be saved again:

```python
model.save_pretrained("./Model")
tokenizer.save_pretrained("./Model")
```



# Challenge 2: Mofa’s Kitchen Buddy

This challenge involves building a backend system to help Mofa manage his ingredients and suggest recipes based on available items. The solution leverages **MongoDB**, **Node.js**, and **Express.js** for database design, API creation, and recipe retrieval.


### **Setup Instructions**

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies by running:
   ```bash
   npm install
   ```
   
### **Start the Program**

To start the program, run the following command:

```bash
nodemon index.js
```

---

## **1. Database Design**

### **Schema for Ingredients**
The ingredients database schema stores the list of available ingredients along with their quantities. Below is the Mongoose schema for this design:

```javascript
import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the ingredient
    quantity: { type: String, required: true }, // Quantity as a string (e.g., "2 cups", "500 ml")
    lastUpdated: { type: Date, default: Date.now }, // Timestamp for when the ingredient was last updated
});

export default mongoose.model("Ingredient", ingredientSchema);
```

### **Schema for Recipes**

The recipes schema stores details about each recipe, including ingredients, steps, and optional metadata such as taste, cuisine, preparation time, and reviews.

```javascript
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
```

## **2. Ingredient Management API**

This API allows adding, updating, retrieving, and deleting ingredients in the database.

---

### **API Endpoints**

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| POST   | `/api/ingredients`     | Add or update ingredients      |
| PUT    | `/api/ingredients/:id` | Update existing ingredient quantities |
| GET    | `/api/ingredients`     | Retrieve all ingredients       |
| DELETE | `/api/ingredients/name`| Delete an ingredient by name   |

---

### **Sample Requests and Responses**

#### **1. Add Ingredients**
Request:

```json
POST /api/ingredients
{
  "ingredients": [
    { "name": "Flour", "quantity": "2 cups" },
    { "name": "Sugar", "quantity": "1.5 cups" },
    { "name": "Milk", "quantity": "500 ml" }
  ]
}
```
#### **2. Update Ingredients**
Request:

```json
PUT /api/ingredients/:id
{
  "ingredients": [
    { "name": "Sugar", "quantity": "2 cups" }
  ]
}
```
#### **3. Get All Ingredients**
Request:

```json
GET /api/ingredients

```
#### **4. Delete Ingredient**
Request:

```json
DELETE /api/ingredients/name
{
  "name": "Sugar"
}
```

## **3. Recipe Retrieval API**

This part of the challenge involves building a system to parse and store recipe details from already saved recipe images or texts into a combined file (`my_fav_recipes.txt`). It also includes developing APIs to input new favorite recipe images or texts.

---

### **API Endpoints**

| Method | Endpoint               | Description                                      |
|--------|------------------------|--------------------------------------------------|
| POST   | `/api/recipes/add`     | Add a new recipe (text-based)                    |
| GET    | `/api/recipes/parse-text` | Parse recipes from `my_fav_recipes.txt` and save to the database |
| POST   | `/api/recipes/parse-image` | Parse recipes from an image (`recipe_image.png`) using OCR and save |
| GET    | `/api/recipes`         | Retrieve all stored recipes                     |

---

### **Details of Endpoints**

#### **1. Add a New Recipe**
**Endpoint**: `POST /api/recipes/add`

**Request Body:**
```json
{
  "name": "Chocolate Cake",
  "ingredients": [
    { "name": "Flour", "quantity": "2 cups" },
    { "name": "Sugar", "quantity": "1.5 cups" },
    { "name": "Cocoa Powder", "quantity": "1/2 cup" }
  ],
  "steps": "Mix ingredients and bake at 350°F for 30 minutes.",
  "taste": "Sweet",
  "reviews": [
    { "user": "John", "comment": "Delicious!", "rating": 5 }
  ],
  "cuisine": "Dessert",
  "preparationTime": 45
}
```

### 2. Parse Recipes from Text File

**Endpoint**: `GET /api/recipes/parse-text`  
**File Used**: `my_fav_recipes.txt`  
**Description**: Parses recipes from the text file and saves them to the database.

### 3. Parse Recipes from Image

**Endpoint**: `POST /api/recipes/parse-image`  
**File Used**: `recipe_image.png`  

**Request Body**:
```json
{
  "imagePath": "recipe_image.png"
}
``` 
Description: Uses OCR to extract text from the image, appends the text to my_fav_recipes.txt, and parses the recipe for saving into the database.



### 4. Get All Recipes

**Endpoint**: `GET /api/recipes`  
**Description**: Retrieves all stored recipes from the database.

## **4. Chatbot Integration API**

This part of the challenge involves integrating a chatbot that interacts with users to suggest recipes based on their preferences and available ingredients. The chatbot leverages the OpenAI GPT model to refine suggestions.

---

### **API Endpoints**

| Method | Endpoint                | Description                                              |
|--------|-------------------------|----------------------------------------------------------|
| POST   | `/api/chatbot`          | Chatbot endpoint for recipe suggestions based on preferences and available ingredients |

---

### **Details of Endpoint**

#### **1. Chatbot Interaction**
**Endpoint**: `POST /api/chatbot`

**Request Body**:
```json
{
  "preferences": "I want something sweet.",
  "availableIngredients": ["Flour", "Sugar", "Eggs"]
}

```

### **Description**

- Fetches all recipes from the database.
- Filters recipes that can be prepared with the available ingredients.
- Uses the OpenAI GPT model to refine suggestions based on user preferences.
- If no matching recipes are found, OpenAI provides alternative recipe ideas based on the provided ingredients.

### **Notes**

- The chatbot uses the OpenAI GPT model to generate suggestions. Ensure your OpenAI API key is configured properly in the `.env` file as `OPENAI_API_KEY`.
- Ingredients are matched exactly with those in the recipes stored in the database. Ensure the ingredient names are consistent.
- When no recipes match, the chatbot generates creative ideas based on user-provided ingredients and preferences.
