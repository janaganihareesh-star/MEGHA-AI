import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  memories: {}, // Grouped by category if requested
  flatList: [],
  isLoading: false,
  error: null
};

// THUNKS
export const fetchMemories = createAsyncThunk(
  'memory/fetchMemories',
  async (grouped = true, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get(`/api/memory?grouped=${grouped}`, getAuthConfig(token));
      return { data: res.data.memories, grouped };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch memories.');
    }
  }
);

export const createMemory = createAsyncThunk(
  'memory/createMemory',
  async (memoryData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.post('/api/memory', memoryData, getAuthConfig(token));
      return res.data.memory;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create memory.');
    }
  }
);

export const updateMemory = createAsyncThunk(
  'memory/updateMemory',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.put(`/api/memory/${id}`, data, getAuthConfig(token));
      return res.data.memory;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to edit memory.');
    }
  }
);

export const deleteMemory = createAsyncThunk(
  'memory/deleteMemory',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`/api/memory/${id}`, getAuthConfig(token));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete memory.');
    }
  }
);

export const togglePin = createAsyncThunk(
  'memory/togglePin',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.put(`/api/memory/${id}/pin`, {}, getAuthConfig(token));
      return res.data.memory;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to pin memory.');
    }
  }
);

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemories.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.grouped) {
          state.memories = action.payload.data;
        } else {
          state.flatList = action.payload.data;
        }
      })
      .addCase(fetchMemories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createMemory.fulfilled, (state, action) => {
        const mem = action.payload;
        if (!state.memories[mem.category]) {
          state.memories[mem.category] = [];
        }
        state.memories[mem.category].push(mem);
        state.flatList.push(mem);
      })
      .addCase(updateMemory.fulfilled, (state, action) => {
        const mem = action.payload;
        if (state.memories[mem.category]) {
          state.memories[mem.category] = state.memories[mem.category].map(m => m._id === mem._id ? mem : m);
        }
        state.flatList = state.flatList.map(m => m._id === mem._id ? mem : m);
      })
      .addCase(deleteMemory.fulfilled, (state, action) => {
        const id = action.payload;
        Object.keys(state.memories).forEach(cat => {
          state.memories[cat] = state.memories[cat].filter(m => m._id !== id);
        });
        state.flatList = state.flatList.filter(m => m._id !== id);
      })
      .addCase(togglePin.fulfilled, (state, action) => {
        const mem = action.payload;
        if (state.memories[mem.category]) {
          state.memories[mem.category] = state.memories[mem.category].map(m => m._id === mem._id ? mem : m);
        }
        state.flatList = state.flatList.map(m => m._id === mem._id ? mem : m);
      });
  }
});

export default memorySlice.reducer;