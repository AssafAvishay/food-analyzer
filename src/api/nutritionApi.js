import axios from 'axios';

// Replace with your actual API ID and key from Edamam
const API_ID = "9d342aa7";  // Make sure these are your actual values
const API_KEY = "aedc10f56d05ae8cec6fb34cfaa7eb5e";  // Make sure these are your actual values

export async function getNutritionInfo(ingredients) {
  const url = 'https://api.edamam.com/api/nutrition-details';

  // Format the ingredients into the structure the API expects
  const formattedIngredients = ingredients.map(ingredient => ({
    "quantity": 1,
    "measure": "g",  // You can adjust this based on how the ingredient is measured
    "food": ingredient,  // Ingredient string
  }));

  const data = {
    "ingredients": formattedIngredients,
  };

  try {
    const response = await axios.post(url, data, {
      params: {
        app_id: API_ID,  // Ensure API_ID is used here
        app_key: API_KEY,  // Ensure API_KEY is used here
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    return null;
  }
}
