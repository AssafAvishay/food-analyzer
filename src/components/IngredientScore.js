import React from 'react';

function IngredientScore({ ingredient, healthStatus, notes }) {
  // Capitalizing the first letter of each ingredient
  const capitalizedIngredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

  return (
    <tr>
      <td>{capitalizedIngredient}</td>
      <td>{healthStatus}</td>
      <td>{notes}</td>
    </tr>
  );
}

export default IngredientScore;
