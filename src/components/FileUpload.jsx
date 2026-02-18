import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileReady }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const acceptedFormats = '.mp3,.m4a,.wav,.webm,.ogg';
  const maxSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file) => {
    if (!file) return { valid: false, error: 'No file selected' };
    
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/x-m4a'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|m4a|wav|webm|ogg)$/i)) {
      return { valid: false, error: 'Invalid file format. Please upload an audio file.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 50MB.' };
    }
    
    return { valid: true };
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (validation.valid) {
        setFile(selectedFile);
      } else {
        alert(validation.error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (validation.valid) {
        setFile(droppedFile);
      } else {
        alert(validation.error);
      }
    }
  };

  const handleSubmit = () => {
    if (file && onFileReady) {
      onFileReady(file);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Audio File
        </h2>
        <p className="text-gray-600">
          Upload a pre-recorded audio file for analysis
        </p>
      </div>

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center 
                      transition-colors ${
            isDragging 
              ? 'border-primary bg-primary-light bg-opacity-10' 
              : 'border-gray-300 hover:border-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" 
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <div>
              <p className="text-lg text-gray-700 mb-2">
                Drag and drop your audio file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary-dark text-white 
                           font-semibold py-3 px-6 rounded-lg 
                           transition-colors duration-200 shadow-md"
              >
                Browse Files
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="text-xs text-gray-500">
              Supported formats: MP3, M4A, WAV, WebM, OGG (Max 50MB)
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center 
                          justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-10 h-10 text-primary" fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
                      clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" 
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                      clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Audio Preview */}
          <audio 
            controls 
            src={URL.createObjectURL(file)} 
            className="w-full"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-dark text-white 
                       font-semibold py-3 px-6 rounded-lg 
                       transition-colors duration-200 shadow-md 
                       w-full flex items-center justify-center space-x-2"
          >
            <span>✅</span>
            <span>Submit for Analysis</span>
          </button>
        </div>
      )}

      {/* Upload Tips */}
      <div className="w-full bg-green-50 border border-green-200 
                      rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-green-900 mb-2">📁 Upload Tips:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Best quality: WAV files (uncompressed)</li>
          <li>• Good balance: MP3 or M4A files</li>
          <li>• Record in a quiet environment</li>
          <li>• Recommended length: 1-5 minutes</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;