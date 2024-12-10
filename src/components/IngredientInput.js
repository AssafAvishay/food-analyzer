import React, { useState, useEffect } from 'react';

function IngredientInput({ onSubmit, ingredients }) {
  const [inputValue, setInputValue] = useState('');

  // Sync inputValue with the ingredients prop whenever it changes
  useEffect(() => {
    setInputValue(ingredients || ''); // Set to an empty string if ingredients is cleared
  }, [ingredients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientsList = inputValue
      .split(',')
      .map(item => item.trim()) // Trim whitespace around each ingredient
      .filter(item => item.length > 0); // Remove any empty strings
    onSubmit(ingredientsList); // Pass the cleaned ingredients list to the parent
  };

  return (
    <div className="ingredient-input-container">
      <h2>Food ingredients to analyze (from photo or pasted manually)</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="large-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update local state on user input
          placeholder="Enter ingredients, e.g., sugar, salt, apple"
          rows="4"  // Initial number of rows (adjustable)
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}

export default IngredientInput;
