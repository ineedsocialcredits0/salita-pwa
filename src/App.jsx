import { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import FileUpload from './components/FileUpload';

function App() {
  const [activeTab, setActiveTab] = useState('record'); // 'record' or 'upload'

  const handleAudioReady = (audioData) => {
    console.log('Audio ready for analysis:', audioData);
    alert('Audio received! In Phase 10, we\'ll show analysis results here.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                    py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          SaLitA
        </h1>
        <p className="text-lg text-gray-600">
          <span className="font-semibold">Sa</span>lita at{' '}
          <span className="font-semibold">Li</span>nangan ng{' '}
          <span className="font-semibold">Ta</span>lino sa Akademiko
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Progressive Speech Coaching for Filipino Students
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex bg-white rounded-lg shadow-md p-1">
          <button
            onClick={() => setActiveTab('record')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold 
                        transition-colors border-2 ${
              activeTab === 'record'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'text-gray-800 bg-white border-gray-400 hover:border-primary hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>🎤</span>
            <span>Record Audio</span>
          </div>
        </button>
      <button
        onClick={() => setActiveTab('upload')}
        className={`flex-1 py-3 px-4 rounded-md font-semibold 
                    transition-colors border-2 ${
          activeTab === 'upload'
            ? 'bg-primary text-white border-primary shadow-md'
            : 'text-gray-800 bg-white border-gray-400 hover:border-primary hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>📁</span>
            <span>Upload File</span>
          </div>
        </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'record' ? (
          <AudioRecorder onAudioReady={handleAudioReady} />
        ) : (
          <FileUpload onFileReady={handleAudioReady} />
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-600">
        <p className="mb-2">
          Designed to help Filipinos strengthen their English fluency.
        </p>
        <p className="text-xs text-gray-500">
          Privacy First: Audio is processed and immediately deleted
        </p>
      </div>
    </div>
  );
}

export default App;