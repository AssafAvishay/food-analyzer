import React, { useState, useEffect } from 'react';
import IngredientInput from './components/IngredientInput';
import PieChart from './components/PieChart';  // Pie chart component
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import IngredientExtractor from './components/IngredientExtractor';  // Import IngredientExtractor
import './App.css';

function App() {
  const [scores, setScores] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'ingredient', direction: 'asc' });
  const [ingredients, setIngredients] = useState(''); // State for ingredients list

  // Fetch the ingredient data from Google Sheets (CSV format)
  useEffect(() => {
    const fetchIngredientData = async () => {
      const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwtGo0aOhiLFp8RAHUifnZaUrNGqIYrP57V2B-tdTi6xeL_b9nn6SQsdpvWlNzncnSOM14bKKfBqWa/pub?gid=0&single=true&output=csv'; // Replace with your published CSV URL
      
      try {
        const response = await fetch(url);
        const text = await response.text();
        Papa.parse(text, {
          complete: (result) => {
            const ingredients = result.data.map((row) => ({
              ingredient: row[0],  // Assuming ingredient is in the first column
              healthStatus: row[1], // Assuming health status is in the second column
              notes: row[2],        // Assuming notes are in the third column
            }));
            setIngredientData(ingredients); // Set the parsed data
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchIngredientData();
  }, []);

  // Handle analyzing ingredients
  const analyzeIngredients = (ingredientsList) => {
    const ingredientScores = ingredientsList.map((ingredientName) => {
      const normalizedIngredientName = ingredientName.toLowerCase().trim();
      const ingredient = ingredientData.find(item => item.ingredient.toLowerCase().trim() === normalizedIngredientName);

      if (ingredient) {
        return {
          ingredient: ingredient.ingredient,
          healthStatus: ingredient.healthStatus,
          notes: ingredient.notes
        };
      } else {
        return {
          ingredient: ingredientName,
          healthStatus: "Unknown",
          notes: "No information available."
        };
      }
    });

    setScores(ingredientScores);
  };

  // Handle sorting
  const handleSort = (column) => {
    let direction = sortConfig.direction;
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc'; // Toggle direction if the same column is clicked again
    }

    const sortedScores = [...scores];
    if (column === 'ingredient') {
      sortedScores.sort((a, b) => a.ingredient < b.ingredient ? (direction === 'asc' ? -1 : 1) : (direction === 'asc' ? 1 : -1));
    } else if (column === 'healthStatus') {
      const healthOrder = ['Unhealthy', 'Neutral', 'Healthy'];
      sortedScores.sort((a, b) => {
        const aHealthStatusIndex = healthOrder.indexOf(a.healthStatus);
        const bHealthStatusIndex = healthOrder.indexOf(b.healthStatus);
        return direction === 'asc' ? aHealthStatusIndex - bHealthStatusIndex : bHealthStatusIndex - aHealthStatusIndex;
      });
    } else if (column === 'notes') {
      sortedScores.sort((a, b) => a.notes < b.notes ? (direction === 'asc' ? -1 : 1) : (direction === 'asc' ? 1 : -1));
    }

    setSortConfig({ key: column, direction });
    setScores(sortedScores);
  };

  return (
    <div className="App">
      <h1>Food Ingredient Analyzer</h1>

      {/* Ingredient Extraction Section */}
      <IngredientExtractor setIngredients={setIngredients} />

      {/* Ingredient List */}
      <IngredientInput onSubmit={analyzeIngredients} ingredients={ingredients} />
      
      <div className="content-container">
        <div className="pie-and-legend-container">
          {scores.length > 0 && <PieChart scores={scores} />}
        </div>

        {/* Sorting controls */}
        {scores.length > 0 && (
          <div className="sort-container">
            <select onChange={(e) => handleSort(e.target.value)} value={sortConfig.key}>
              <option value="ingredient">Sort by Ingredient</option>
              <option value="healthStatus">Sort by Health Status</option>
              <option value="notes">Sort by Notes</option>
            </select>
            <button onClick={() => setSortConfig({ ...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
              {sortConfig.direction === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        )}

        {scores.length > 0 && (
          <div className="ingredient-list-container">
            <table className="ingredient-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('ingredient')}>Ingredient</th>
                  <th onClick={() => handleSort('healthStatus')}>Healthy?</th>
                  <th onClick={() => handleSort('notes')}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ingredient}</td>
                    <td style={{ color: item.healthStatus === 'Healthy' ? 'green' : item.healthStatus === 'Neutral' ? 'blue' : item.healthStatus === 'Unknown' ? 'grey' : 'red' }}>
                      {item.healthStatus}
                    </td>
                    <td>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
