import { supabase } from './supabase';

// Create or get user profile
export const getOrCreateProfile = async (userId, fullName) => {
  try {
    // Check if profile exists
    const { data: existing, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) return { data: existing, error: null };

    // Create new profile if doesn't exist
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          full_name: fullName || 'Student',
          current_level: 1,
          total_recordings: 0,
          average_score: 0
        }
      ])
      .select()
      .single();

    return { data: newProfile, error: createError };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Save recording to database
export const saveRecording = async (userId, analysisResult) => {
  try {
    const { data, error } = await supabase
      .from('recordings')
      .insert([
        {
          user_id: userId,
          transcript: analysisResult.transcript,
          score: analysisResult.score,
          level: analysisResult.level,
          english_ratio: analysisResult.metrics.englishRatio,
          filler_count: analysisResult.metrics.fillerCount,
          pace: analysisResult.metrics.pace,
          feedback: analysisResult.feedback,
          audio_duration: analysisResult.duration || 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Update user profile stats
    await updateProfileStats(userId);

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Update user profile statistics
export const updateProfileStats = async (userId) => {
  try {
    // Get all user recordings
    const { data: recordings, error: fetchError } = await supabase
      .from('recordings')
      .select('score')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    const totalRecordings = recordings.length;
    const averageScore = totalRecordings > 0
      ? recordings.reduce((sum, r) => sum + r.score, 0) / totalRecordings
      : 0;

    // Update profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        total_recordings: totalRecordings,
        average_score: Math.round(averageScore),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Get user's recording history
export const getUserRecordings = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('recordings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};