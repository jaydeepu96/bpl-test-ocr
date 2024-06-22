import React, { useState } from 'react';
import axios from 'axios';
import '../css/ocr.css';
import ExportComponent from './ExportComponent'; 
import { diffChars } from 'diff';

const OCRComponent = () => {
  const [prevFileName, setPrevFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [prevFile, setPrevFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [error, setError] = useState(null);
  const [isPrevUploaded, setIsPrevUploaded] = useState(false);
  const [isNewUploaded, setIsNewUploaded] = useState(false);
  const [diffResult, setDiffResult] = useState(null);
  const [prevFileText, setPrevFileText] = useState('');
  const [newFileText, setNewFileText] = useState('');

  const handleFileChange = (e, setFile, setFileName) => {
    const file = e.target.files[0];
    setFile(file);
    setFileName(file.name);
  };

  const uploadFile = async (file, setFileName, setIsUploaded, setTextState) => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileName(response.data.fileName);
      setIsUploaded(true);
      setTextState(response.data.text);
      setError(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');
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

  
    const differences = diffChars(prevFileText, newFileText);


    let diffHTML = '';
    differences.forEach(part => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      diffHTML += `<span style="color: ${color}">${part.value}</span>`;
    });

    setDiffResult(diffHTML);
    setError(null);
  };

  return (
    <div className="ocr-container">
      <h1 className="ocr-header">OCR Integration</h1>
      {!diffResult && (
        <div className="file-upload-container">
          <div className="file-upload">
            <label htmlFor="prevFile">Upload Older File (PDF or DOC/DOCX):</label>
            <input type="file" id="prevFile" onChange={(e) => handleFileChange(e, setPrevFile, setPrevFileName)} className="ocr-input" />
            <button onClick={() => uploadFile(prevFile, setPrevFileName, setIsPrevUploaded, setPrevFileText)} className="ocr-button">Upload</button>
            {prevFileName && <p>Uploaded Older File: {prevFileName}</p>}
            {isPrevUploaded && (
              <div>
                <h2>Older File Content:</h2>
                <p>{prevFileText}</p>
              </div>
            )}
          </div>
          <div className="file-upload">
            <label htmlFor="newFile">Upload New File (PDF or DOC/DOCX):</label>
            <input type="file" id="newFile" onChange={(e) => handleFileChange(e, setNewFile, setNewFileName)} className="ocr-input" />
            <button onClick={() => uploadFile(newFile, setNewFileName, setIsNewUploaded, setNewFileText)} className="ocr-button">Upload</button>
            {newFileName && <p>Uploaded New File: {newFileName}</p>}
            {isNewUploaded && (
              <div>
                <h2>New File Content:</h2>
                <p>{newFileText}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <button onClick={handleCompare} className="ocr-button">Compare</button>
      {error && <p className="ocr-error">{error}</p>}
      {diffResult && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: diffResult }} className="diff-result" />
          <ExportComponent text={diffResult} /> 
        </div>
      )}
    </div>
  );
};

export default OCRComponent;
