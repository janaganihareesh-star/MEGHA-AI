import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  sessions: [],         // past interview session list
  currentSession: null, // active session metadata
  finalResult: null,    // last completed interview result
  isLoading: false,
  isStarting: false,
  isSubmitting: false,
  error: null
};

// Fetch past interview sessions history
export const fetchInterviewHistory = createAsyncThunk(
  'interview/fetchHistory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/interview/history', getAuthConfig(token));
      return res.data.sessions || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load interview history.');
    }
  }
);

// Start a new interview session
export const startInterviewSession = createAsyncThunk(
  'interview/startSession',
  async ({ type, role, resumeId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post('/api/interview/start', { type, role, resumeId }, getAuthConfig(token));
      return res.data; // { sessionId, firstQuestion, totalQuestions }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to start interview session.');
    }
  }
);

// Submit an answer to a question
export const submitInterviewAnswer = createAsyncThunk(
  'interview/submitAnswer',
  async ({ sessionId, questionIndex, answer }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post('/api/interview/answer', { sessionId, questionIndex, answer }, getAuthConfig(token));
      return res.data; // { evaluation, nextQuestion, nextQuestionIndex, completed }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to evaluate answer.');
    }
  }
);

// Fetch final interview result
export const fetchInterviewResult = createAsyncThunk(
  'interview/fetchResult',
  async (sessionId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get(`/api/interview/result/${sessionId}`, getAuthConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch interview result.');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    clearInterviewSession(state) {
      state.currentSession = null;
      state.finalResult = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchInterviewHistory
      .addCase(fetchInterviewHistory.pending, (state) => { state.isLoading = true; })
      .addCase(fetchInterviewHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchInterviewHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // startInterviewSession
      .addCase(startInterviewSession.pending, (state) => { state.isStarting = true; state.error = null; })
      .addCase(startInterviewSession.fulfilled, (state, action) => {
        state.isStarting = false;
        state.currentSession = action.payload;
      })
      .addCase(startInterviewSession.rejected, (state, action) => {
        state.isStarting = false;
        state.error = action.payload;
      })

      // submitInterviewAnswer
      .addCase(submitInterviewAnswer.pending, (state) => { state.isSubmitting = true; })
      .addCase(submitInterviewAnswer.fulfilled, (state) => { state.isSubmitting = false; })
      .addCase(submitInterviewAnswer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // fetchInterviewResult
      .addCase(fetchInterviewResult.pending, (state) => { state.isLoading = true; })
      .addCase(fetchInterviewResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.finalResult = action.payload;
      })
      .addCase(fetchInterviewResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearInterviewSession } = interviewSlice.actions;
export default interviewSlice.reducer;
