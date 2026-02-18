import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

const AudioRecorder = ({ onAudioReady }) => {
  const {
    isRecording,
    audioBlob,
    recordingTime,
    error,
    startRecording,
    stopRecording,
    clearRecording
  } = useAudioRecorder();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Record Your Speech
        </h2>
        <p className="text-gray-600">
          Speak naturally in Taglish or English. We'll analyze your fluency!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 
                        px-4 py-3 rounded-lg mb-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-mono font-bold text-red-500">
              RECORDING
            </span>
          </div>
        )}

        {/* Timer */}
        <div className="text-5xl font-mono font-bold text-gray-800">
          {formatTime(recordingTime)}
        </div>

        {/* Audio Preview */}
        {audioBlob && !isRecording && (
          <div className="w-full">
            <audio 
              controls 
              src={URL.createObjectURL(audioBlob)} 
              className="w-full"
            />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="bg-primary hover:bg-primary-dark text-white 
                         font-semibold py-3 px-6 rounded-lg 
                         transition-colors duration-200 shadow-md 
                         flex items-center space-x-2"
            >
              <span>🎤</span>
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white 
                         font-semibold py-3 px-6 rounded-lg 
                         transition-colors duration-200 shadow-md 
                         flex items-center space-x-2"
            >
              <span>⏹️</span>
              <span>Stop Recording</span>
            </button>
          )}

          {audioBlob && !isRecording && (
            <>
              <button
                onClick={() => onAudioReady && onAudioReady(audioBlob)}
                className="bg-primary hover:bg-primary-dark text-white 
                           font-semibold py-3 px-6 rounded-lg 
                           transition-colors duration-200 shadow-md 
                           flex items-center space-x-2"
              >
                <span>✅</span>
                <span>Submit for Analysis</span>
              </button>

              <button
                onClick={clearRecording}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 
                           font-semibold py-3 px-6 rounded-lg 
                           transition-colors duration-200 
                           flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Record Again</span>
              </button>
            </>
          )}
        </div>

        {/* Recording Tips */}
        <div className="w-full bg-blue-50 border border-blue-200 
                        rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Recording Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Find a quiet environment for best results</li>
            <li>• Hold your device close to your mouth</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;