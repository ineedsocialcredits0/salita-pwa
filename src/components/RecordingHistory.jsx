import React, { useEffect, useState } from 'react';
import { getUserRecordings } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

const RecordingHistory = () => {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecordings = async () => {
      const { data, error } = await getUserRecordings(user.id, 20);
      if (data) setRecordings(data);
      setLoading(false);
    };

    if (user) {
      loadRecordings();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="card max-w-4xl mx-auto text-center py-8">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="card max-w-4xl mx-auto text-center py-8">
        <p className="text-xl font-semibold text-gray-800 mb-2">
          No recordings yet!
        </p>
        <p className="text-gray-600">
          Start practicing to see your progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Recording History
      </h2>

      <div className="space-y-4">
        {recordings.map((recording) => (
          <div
            key={recording.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 
                       hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">
                  {formatDate(recording.created_at)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Level {recording.level}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-bold text-xl 
                              ${getScoreColor(recording.score)}`}>
                {recording.score}%
              </div>
            </div>

            <p className="text-gray-700 italic mb-3">
              "{recording.transcript.substring(0, 150)}
              {recording.transcript.length > 150 ? '...' : ''}"
            </p>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="font-semibold text-blue-600">
                  {recording.english_ratio}%
                </div>
                <div className="text-gray-600 text-xs">English</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="font-semibold text-purple-600">
                  {recording.filler_count}
                </div>
                <div className="text-gray-600 text-xs">Fillers</div>
              </div>
              <div className="bg-white rounded px-3 py-2 text-center">
                <div className="font-semibold text-green-600">
                  {recording.pace} wpm
                </div>
                <div className="text-gray-600 text-xs">Pace</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingHistory;