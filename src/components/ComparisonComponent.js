import React, { useState } from 'react';
import axios from 'axios';
import '../css/ocr.css';
import ComparisonComponent from './ComparisonComponent';

const OCRComponent = () => {
  const [prevFileName, setPrevFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [prevFile, setPrevFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [error, setError] = useState(null);
  const [isPrevUploaded, setIsPrevUploaded] = useState(false);
  const [isNewUploaded, setIsNewUploaded] = useState(false);
  const [diffResult, setDiffResult] = useState(null);

  const handleFileChange = (e, setFile, setFileName) => {
    const file = e.target.files[0];
    setFile(file);
    setFileName(file.name);
  };

  const uploadPrevFile = async () => {
    if (!prevFile) {
      setError('Please select the older file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', prevFile);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrevFileName(response.data.fileName);
      setIsPrevUploaded(true);
      setError(null);
    } catch (error) {
      console.error('Error uploading older file:', error);
      setError('Error uploading older file. Please try again.');
    }
  };

  const uploadNewFile = async () => {
    if (!newFile) {
      setError('Please select the new file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', newFile);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewFileName(response.data.fileName);
      setIsNewUploaded(true);
      setError(null);
    } catch (error) {
      console.error('Error uploading new file:', error);
      setError('Error uploading new file. Please try again.');
    }
  };

  const handleCompare = async () => {
    if (!prevFile || !newFile) {
      setError('Please select both files before comparing.');
      return;
    }

    if (!isPrevUploaded || !isNewUploaded) {
      setError('Please upload both files before comparing.');
      return;
    }

    const formData = new FormData();
    formData.append('prevFileName', prevFileName); 
    formData.append('newFileName', newFileName);

    try {
      const response = await axios.post('http://localhost:3000/compare-documents', formData);
      setDiffResult(response.data.diff);
      setError(null);
    } catch (error) {
      console.error('Error comparing files:', error);
      setError('Error comparing files. Please try again.');
    }
  };

  return (
    <div className="ocr-container">
      <h1 className="ocr-header">OCR Integration</h1>
      <div>
        <label htmlFor="prevFile">Upload Older File:</label>
        <input type="file" id="prevFile" onChange={(e) => handleFileChange(e, setPrevFile, setPrevFileName)} className="ocr-input" />
        <button onClick={uploadPrevFile} className="ocr-button">Upload</button>
        {prevFileName && <p>Uploaded Older File: {prevFileName}</p>}
      </div>
      <div>
        <label htmlFor="newFile">Upload New File:</label>
        <input type="file" id="newFile" onChange={(e) => handleFileChange(e, setNewFile, setNewFileName)} className="ocr-input" />
        <button onClick={uploadNewFile} className="ocr-button">Upload</button>
        {newFileName && <p>Uploaded New File: {newFileName}</p>}
      </div>
      <button onClick={handleCompare} className="ocr-button">Compare</button>
      {error && <p className="ocr-error">{error}</p>}
      {diffResult && <ComparisonComponent diff={diffResult} />}
    </div>
  );
};

export default OCRComponent;
