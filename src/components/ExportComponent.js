import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph } from 'docx';
import jsPDF from 'jspdf';

import '../css/export.css';

const ExportComponent = ({ text }) => {
  const exportToWord = () => {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph({ text: text.replace(/<[^>]+>/g, '') })]
        }
      ]
    });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'document.docx');
    });
  };

  const exportToPDF = () => {
    const plainText = text.replace(/<[^>]+>/g, '');
    const doc = new jsPDF();
    doc.text(plainText, 10, 10);
    doc.save('document.pdf');
  };

  const exportToText = () => {
    const plainText = text.replace(/<[^>]+>/g, ''); 
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'document.txt');
  };

  return (
    <div className="export-container">
      <h1 className="export-header">Export Options</h1>
      <button className="export-button" onClick={exportToWord}>Export to Word</button>
      <button className="export-button" onClick={exportToPDF}>Export to PDF</button>
      <button className="export-button" onClick={exportToText}>Export to Text</button>
    </div>
  );
};

export default ExportComponent;
