import React from 'react';
import { Pie } from 'react-chartjs-2';  // Import the Pie chart component from react-chartjs-2

// Import Chart.js core and elements
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ scores }) => {
  // Count the health statuses and include the "Unknown" category
  const healthStatusCounts = {
    healthy: scores.filter(item => item.healthStatus === 'Healthy').length,
    neutral: scores.filter(item => item.healthStatus === 'Neutral').length,
    unhealthy: scores.filter(item => item.healthStatus === 'Unhealthy').length,
    unknown: scores.filter(item => item.healthStatus === 'Unknown').length,  // Count Unknown status
  };

  // Prepare the data for the pie chart
  const data = {
    labels: ['Healthy', 'Neutral', 'Unhealthy', 'Unknown'],  // Add "Unknown" to the labels
    datasets: [
      {
        data: [
          healthStatusCounts.healthy,
          healthStatusCounts.neutral,
          healthStatusCounts.unhealthy,
          healthStatusCounts.unknown,  // Add Unknown count to the data
        ],
        backgroundColor: ['green', 'blue', 'red', 'grey'],  // Add grey for "Unknown"
      },
    ],
  };

  // Pie chart options, including disabling the legend
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,  // This removes the legend from the pie chart itself
      },
    },
  };

  return (
    <div className="pie-and-legend-container">
      <div className="pie-chart-container">
        <Pie data={data} options={options} />  {/* Render Pie chart with data and options */}
      </div>

      {/* Legend Section */}
      <div className="pie-legend">
        <div className="legend-item">
          <span className="legend-color healthy"></span>
          <span>Healthy: {healthStatusCounts.healthy}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color neutral"></span>
          <span>Neutral: {healthStatusCounts.neutral}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unhealthy"></span>
          <span>Unhealthy: {healthStatusCounts.unhealthy}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unknown"></span> {/* Add Unknown color */}
          <span>Unknown: {healthStatusCounts.unknown}</span> {/* Add Unknown count */}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
