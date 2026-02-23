import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AudioRecorder from './components/AudioRecorder';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import Auth from './components/Auth';
import { saveRecording, getOrCreateProfile } from './lib/database';
import RecordingHistory from './components/RecordingHistory';

function App() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('record');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeAudio = async (audioData) => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate analysis delay

    const mockResult = {
      transcript: "So parang, ano, I think na kailangan natin mag-focus sa, like, yung main objectives ng project, you know?",
      score: 72,
      level: 2,
      feedback: "Great job! You're making progress. Try reducing filler words.",
      metrics: {
        englishRatio: 65,
        fillerCount: 8,
        pace: 145
      },
      duration: 45 //seconds
    };

    // Save to database
    const { error } = await saveRecording(user.id, mockResult);
    if (error) {
      console.error("Error saving recording:", error);
      alert('Recording analysis failed to save. Please try again.');
    }

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  }

  const handleAudioReady = async (audioData) => {
    await analyzeAudio(audioData);
  };

  const handleNewRecording = () => {
    setAnalysisResult(null);
    setActiveTab('record');
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                      flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Auth />;
  }

  // Show results
  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <AnalysisResult result={analysisResult} onNewRecording={handleNewRecording} />
      </div>
    );
  }

  // Show loading
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                      flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent 
                            rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              Analyzing Your Speech...
            </h2>
            <p className="text-gray-600">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  // Show main interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Header with Logout */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              SaLitA
            </h1>
            <p className="text-sm text-gray-500">
              Welcome, {user.user_metadata?.full_name || user.email}!
            </p>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-primary 
                       px-4 py-2 rounded-lg hover:bg-white transition-colors"
          >
            Logout
          </button>
        </div>
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
                : 'text-gray-800 bg-white border-gray-400 hover:border-primary'
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
                : 'text-gray-800 bg-white border-gray-400 hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📁</span>
              <span>Upload File</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold 
                        transition-colors border-2 ${
              activeTab === 'history'
                ? 'bg-primary text-white border-primary shadow-md'
                : 'text-gray-800 bg-white border-gray-400 hover:border-primary'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>History</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'record' ? (
          <AudioRecorder onAudioReady={handleAudioReady} />
        ) : activeTab === 'upload' ? (
          <FileUpload onAudioReady={handleAudioReady} />
        ) : (
          <RecordingHistory userId={user.id} />
        )}
      </div>
    </div>
  );
}

export default App;