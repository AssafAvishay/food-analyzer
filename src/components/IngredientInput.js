import React, { useState, useEffect } from 'react';

function IngredientInput({ onSubmit, ingredients }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (ingredients) {
      setInputValue(ingredients); // Update the input value if ingredients prop changes
    }
  }, [ingredients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientsList = inputValue.split(',').map(item => item.trim());
    onSubmit(ingredientsList);
  };

  return (
    <div className="ingredient-input-container">
      <h2>Food ingredients to analyze (from photo or pasted manually)</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="large-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter ingredients, e.g., sugar, salt, apple"
          rows="4"  // Initial number of rows (adjustable)
        />
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}

export default IngredientInput;
