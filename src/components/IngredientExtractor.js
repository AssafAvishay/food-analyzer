import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const IngredientExtractor = ({ setIngredients, reset }) => {
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

  // Handle pasted image
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          setImage(URL.createObjectURL(file));
          setError('');
          break;
        }
      }
    }
  };

  // Add paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

// Reset state when the reset prop changes
useEffect(() => {
  setImage(null);
  setIsProcessing(false);
  setError('');
}, [reset]);


  // Extract text from the image using Tesseract.js
  const extractTextFromImage = () => {
    if (!image) {
      setError('Please upload or paste an image first');
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
  
      // Cleaning the OCR text to extract pure ingredient names
      const cleanText = text
        .replace(/ingredients?/gi, '') // Remove "ingredients" (case-insensitive)
        .split('\n') // Split into lines
        .map(line => line.replace(/[^a-zA-Z\s]/g, '').trim()) // Remove non-alphabet characters and trim whitespace
        .filter(line => line.length > 0) // Filter out empty lines
        .join(', '); // Join all ingredients with a comma and space
  
      setIngredients(cleanText); // Set the cleaned text to the parent state
    }).catch((err) => {
      setIsProcessing(false);
      setError('An error occurred during OCR. Please try again.');
      console.error(err);
    });
  };  
  

  return (
    <div className="ingredient-extractor-container">
      <h2>Upload or Paste a Photo of the Ingredients</h2>
      <p className="paste-instruction">You can paste an image using Ctrl+V / Cmd+V</p>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {image && <img src={image} alt="Uploaded" width="300" />}

      <div>
        <button onClick={extractTextFromImage} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Extract ingredients from photo'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default IngredientExtractor;
