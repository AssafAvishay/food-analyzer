import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const IngredientExtractor = ({ setIngredients }) => {
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setError(''); // Reset any previous error message
    }
  };

  // Extract text from the image using Tesseract.js
  const extractTextFromImage = () => {
    if (!image) {
      setError('Please upload an image first');
      return;
    }
    
    setIsProcessing(true); // Start the processing state
    setError('');

    Tesseract.recognize(
      image, // The image file to be processed
      'eng', // Language code (English)
      {
        logger: (m) => console.log(m), // Optional logger for progress
      }
    ).then(({ data: { text } }) => {
      setIsProcessing(false); // End the processing state
      setIngredients(text); // Set the extracted text to the parent state
    }).catch((err) => {
      setIsProcessing(false);
      setError('An error occurred during OCR. Please try again.');
      console.error(err);
    });
  };

  return (
    <div className="ingredient-extractor-container">
      {/* Title for the photo upload */}
      <h2>Upload a Photo of the Ingredients</h2>

      {/* File input for uploading image */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {image && <img src={image} alt="Uploaded" width="300" />}

      <div>
        {/* Styled upload photo button */}
        <button onClick={extractTextFromImage} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Extract ingredients from photo'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default IngredientExtractor;
