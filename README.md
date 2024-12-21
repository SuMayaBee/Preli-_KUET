Hackathon Preliminary Challenges - BitFest 2025
Challenge 1: Banglish-to-Bengali Transliteration
Problem Statement
Iqbal needs a solution to convert Banglish (Bengali written in English characters) to Bengali script after losing access to a Bengali typing tool. This challenge involves training a sequence-to-sequence model for transliteration.

Solution
Dataset Preparation
Dataset Used: SKNahin/bengali-transliteration-data.
The dataset was split into training (80%) and validation (20%) sets.
Model
Model Type: mBART (Multilingual BART)
Why mBART? It is pre-trained on multilingual text, making it suitable for low-resource language tasks like Banglish-to-Bengali transliteration.
Workflow
Preprocessing

Tokenized Banglish and Bengali text using sequence-to-sequence tokenization.
Cleaned the data by filtering excessively long or short sentences.
Training

Fine-tuned mBART using the Hugging Face Transformers library.
Hyperparameters:
Learning Rate: 5e-5
Batch Size: 16
Epochs: 5
Framework: PyTorch.
Model Storage

The trained model is stored in the GitHub repository under the Model directory.
Deliverables
Trained Model: GitHub Repository - Model Directory
Jupyter Notebook: Located in the Challenge1 directory as banglish_transliteration.ipynb.
Challenge 2: Mofa’s Kitchen Buddy
Problem Statement
Mofa wants a backend system to:

Manage and update ingredients dynamically.
Parse recipes from saved images or text files into a unified structure.
Suggest recipes based on available ingredients using a chatbot.
Solution
Database Design
Ingredients Schema
name: Ingredient name.
quantity: Quantity of the ingredient.
Recipes Schema
name: Recipe name.
ingredients: List of ingredients with name and quantity.
steps: Recipe preparation steps.
taste: Taste of the recipe (e.g., Sweet, Savory).
cuisine: Cuisine type (e.g., Italian, Bengali).
preparationTime: Preparation time in minutes.
reviews: User reviews with user, comment, and rating.
Ingredient Management API
Endpoints
POST /api/ingredients - Add or update ingredients.
GET /api/ingredients - Get all stored ingredients.
DELETE /api/ingredients - Delete an ingredient.
Recipe Retrieval
Parsing Recipes

Recipes stored in my_fav_recipes.txt are parsed and saved to the database.
Optional fields such as taste, cuisine, and preparationTime are included for easier retrieval.
Added OCR functionality using tesseract.js to parse recipes from images.
Endpoints

GET /api/recipes/parse-text - Parse recipes from my_fav_recipes.txt.
POST /api/recipes/parse-image - Parse recipes from an image using OCR.
Chatbot Integration
Model

OpenAI GPT-based chatbot for recipe suggestions.
Functionality

Accepts user preferences (e.g., "I want something sweet").
Suggests recipes based on available ingredients and preferences.
Endpoint

POST /api/chatbot - Suggest recipes based on user preferences.
API Documentation
Ingredient Management API
Add or Update Ingredients

Route: /api/ingredients
Method: POST
Sample Payload:
json
Copy code
{
  "ingredients": [
    { "name": "Sugar", "quantity": "2 cups" },
    { "name": "Milk", "quantity": "500 ml" }
  ]
}
Get All Ingredients

Route: /api/ingredients
Method: GET
Sample Response:
json
Copy code
[
  { "name": "Sugar", "quantity": "2 cups" },
  { "name": "Milk", "quantity": "500 ml" }
]
Delete an Ingredient

Route: /api/ingredients
Method: DELETE
Sample Payload:
json
Copy code
{
  "name": "Sugar"
}
Recipe Retrieval API
Parse Recipes from Text File

Route: /api/recipes/parse-text
Method: GET
Sample Response:
json
Copy code
{
  "message": "Recipes parsed and saved successfully."
}
Parse Recipe from Image

Route: /api/recipes/parse-image
Method: POST
Sample Payload:
json
Copy code
{
  "imagePath": "path/to/image.jpg"
}
Chatbot API
Suggest Recipes
Route: /api/chatbot
Method: POST
Sample Payload:
json
Copy code
{
  "preferences": "I want something sweet"
}
Sample Response:
json
Copy code
{
  "suggestion": "How about making Chocolate Cake? Ingredients: Sugar, Cocoa Powder, Milk. Steps: Mix and bake."
}
