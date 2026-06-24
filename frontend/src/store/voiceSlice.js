import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null
};

export const fetchVoiceConversations = createAsyncThunk(
  'voice/fetchConversations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/voice/history', getAuthConfig(token));
      return res.data.conversations;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load voice history.');
    }
  }
);

export const fetchVoiceMessages = createAsyncThunk(
  'voice/fetchMessages',
  async (conversationId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get(`/api/chat/${conversationId}/messages`, getAuthConfig(token));
      return res.data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load voice messages.');
    }
  }
);

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
    },
    addVoiceMessage(state, action) {
      state.messages.push(action.payload);
    },
    clearVoice(state) {
      state.messages = [];
      state.currentConversation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoiceConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVoiceConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchVoiceConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVoiceMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVoiceMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      });
  }
});

export const { setCurrentConversation, addVoiceMessage, clearVoice } = voiceSlice.actions;
export default voiceSlice.reducer;