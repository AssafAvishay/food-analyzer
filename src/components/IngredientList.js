import React from 'react';
import IngredientScore from './IngredientScore';

function IngredientList({ scores }) {
  return (
    <div className="ingredient-list">
      {scores.map((item, index) => (
        <IngredientScore key={index} ingredient={item.ingredient} healthStatus={item.healthStatus} notes={item.notes} />
      ))}
    </div>
  );
}

export default IngredientList;
