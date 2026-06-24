import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  progress: null,       // LearningProgress doc (topics, streak, completed count)
  messages: [],         // in-memory tutor chat messages
  isLoading: false,
  isSending: false,
  error: null
};

// Fetch learning progress for logged-in user
export const fetchLearningProgress = createAsyncThunk(
  'learning/fetchProgress',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/learning/progress', getAuthConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load learning progress.');
    }
  }
);

// Send a message to the AI tutor
export const sendTutorMessage = createAsyncThunk(
  'learning/sendMessage',
  async ({ message, history }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post('/api/learning/chat', { message, history }, getAuthConfig(token));
      return res.data; // { reply }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Tutor failed to respond.');
    }
  }
);

// Log a completed learning topic
export const logLearningTopic = createAsyncThunk(
  'learning/logTopic',
  async (topicData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post('/api/learning/log', topicData, getAuthConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to log topic.');
    }
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    // Add a user message locally before API response
    addUserMessage(state, action) {
      state.messages.push({ role: 'user', text: action.payload });
    },
    // Add a tutor model message
    addModelMessage(state, action) {
      state.messages.push({ role: 'model', text: action.payload });
    },
    // Reset the tutor conversation
    clearTutorChat(state) {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchLearningProgress
      .addCase(fetchLearningProgress.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLearningProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
      })
      .addCase(fetchLearningProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // sendTutorMessage
      .addCase(sendTutorMessage.pending, (state) => { state.isSending = true; state.error = null; })
      .addCase(sendTutorMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push({ role: 'model', text: action.payload.reply });
      })
      .addCase(sendTutorMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })

      // logLearningTopic
      .addCase(logLearningTopic.fulfilled, (state, action) => {
        state.progress = action.payload;
      });
  }
});

export const { addUserMessage, addModelMessage, clearTutorChat } = learningSlice.actions;
export default learningSlice.reducer;
