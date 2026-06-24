import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  preferences: null,    // UserPreference doc
  journeyData: null,    // relationship journey (milestones, first msg date)
  stats: null,          // relationship stats (bond level, streak, messages)
  moodAnalytics: null,  // current/last month mood distributions
  moodTrend: null,      // daily trend chart data
  isLoading: false,
  error: null
};

// Fetch full companion preferences
export const fetchPreferences = createAsyncThunk(
  'profile/fetchPreferences',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/profile/preferences', getAuthConfig(token));
      return res.data.preference;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load preferences.');
    }
  }
);

// Update any preference fields
export const updatePreferences = createAsyncThunk(
  'profile/updatePreferences',
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.put('/api/profile/preferences', updates, getAuthConfig(token));
      return res.data.preference;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save preferences.');
    }
  }
);

// Fetch relationship stats (bond level, messages, voice)
export const fetchRelationshipStats = createAsyncThunk(
  'profile/fetchRelationshipStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/relationship/stats', getAuthConfig(token));
      return res.data.stats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load relationship stats.');
    }
  }
);

// Fetch full relationship journey (milestones, first message, bond history)
export const fetchRelationshipJourney = createAsyncThunk(
  'profile/fetchRelationshipJourney',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/relationship/journey', getAuthConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load journey data.');
    }
  }
);

// Fetch mood analytics (current/last month distribution + trend)
export const fetchMoodAnalytics = createAsyncThunk(
  'profile/fetchMoodAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/mood/analytics', getAuthConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load mood analytics.');
    }
  }
);

// Fetch mood trend (last N days chart data)
export const fetchMoodTrend = createAsyncThunk(
  'profile/fetchMoodTrend',
  async (days = 30, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get(`/api/mood/trend?days=${days}`, getAuthConfig(token));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load mood trend.');
    }
  }
);

// Update theme (dark/light)
export const updateTheme = createAsyncThunk(
  'profile/updateTheme',
  async (themeMode, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.put('/api/profile/theme', { themeMode }, getAuthConfig(token));
      return res.data.preference;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update theme.');
    }
  }
);

// Update trusted emergency contacts
export const updateTrustedContacts = createAsyncThunk(
  'profile/updateTrustedContacts',
  async (contacts, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.put('/api/profile/trusted-contacts', contacts, getAuthConfig(token));
      return res.data.preference;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update contacts.');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.preferences = null;
      state.journeyData = null;
      state.stats = null;
      state.moodAnalytics = null;
      state.moodTrend = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPreferences
      .addCase(fetchPreferences.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // updatePreferences
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })

      // fetchRelationshipStats
      .addCase(fetchRelationshipStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // fetchRelationshipJourney
      .addCase(fetchRelationshipJourney.fulfilled, (state, action) => {
        state.journeyData = action.payload;
      })

      // fetchMoodAnalytics
      .addCase(fetchMoodAnalytics.fulfilled, (state, action) => {
        state.moodAnalytics = action.payload;
      })

      // fetchMoodTrend
      .addCase(fetchMoodTrend.fulfilled, (state, action) => {
        state.moodTrend = action.payload;
      })

      // updateTheme
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })

      // updateTrustedContacts
      .addCase(updateTrustedContacts.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  }
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
