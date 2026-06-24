import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  activeGoals: [],
  completedGoals: [],
  achievements: [],
  dreams: [],
  dates: [],
  isLoading: false,
  error: null
};

// GOALS THUNKS
export const fetchGoals = createAsyncThunk('goal/fetchGoals', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.get('/api/goals', getAuthConfig(token));
    return res.data; // active, completed
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch goals.');
  }
});

export const createGoal = createAsyncThunk('goal/createGoal', async (goalData, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.post('/api/goals', goalData, getAuthConfig(token));
    return res.data.goal;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create goal.');
  }
});

export const updateGoal = createAsyncThunk('goal/updateGoal', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.put(`/api/goals/${id}`, data, getAuthConfig(token));
    return res.data.goal;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update goal.');
  }
});

export const deleteGoal = createAsyncThunk('goal/deleteGoal', async (id, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    await axios.delete(`/api/goals/${id}`, getAuthConfig(token));
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete goal.');
  }
});

export const breakdownGoal = createAsyncThunk('goal/breakdownGoal', async (id, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.post(`/api/goals/${id}/breakdown`, {}, getAuthConfig(token));
    return { id, steps: res.data.steps };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'AI Breakdown failed.');
  }
});

// ACHIEVEMENTS THUNKS
export const fetchAchievements = createAsyncThunk('goal/fetchAchievements', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.get('/api/achievements', getAuthConfig(token));
    return res.data.achievements;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch achievements.');
  }
});

// DREAMS THUNKS
export const fetchDreams = createAsyncThunk('goal/fetchDreams', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.get('/api/dreamboard', getAuthConfig(token));
    return res.data.dreams;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch dreams.');
  }
});

export const createDream = createAsyncThunk('goal/createDream', async (dreamData, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.post('/api/dreamboard', dreamData, getAuthConfig(token));
    return res.data.dream;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save dream.');
  }
});

export const updateDream = createAsyncThunk('goal/updateDream', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.put(`/api/dreamboard/${id}`, data, getAuthConfig(token));
    return res.data.dream;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to edit dream.');
  }
});

export const deleteDream = createAsyncThunk('goal/deleteDream', async (id, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    await axios.delete(`/api/dreamboard/${id}`, getAuthConfig(token));
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete dream.');
  }
});

// DATES THUNKS
export const fetchDates = createAsyncThunk('goal/fetchDates', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.get('/api/dates', getAuthConfig(token));
    return res.data.dates;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load dates.');
  }
});

export const createDate = createAsyncThunk('goal/createDate', async (dateData, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const res = await axios.post('/api/dates', dateData, getAuthConfig(token));
    return res.data.date;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create date.');
  }
});

export const deleteDate = createAsyncThunk('goal/deleteDate', async (id, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    await axios.delete(`/api/dates/${id}`, getAuthConfig(token));
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete date.');
  }
});

const goalSlice = createSlice({
  name: 'goal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch goals
      .addCase(fetchGoals.pending, (state) => { state.isLoading = true; })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeGoals = action.payload.active;
        state.completedGoals = action.payload.completed;
      })
      .addCase(fetchGoals.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      // create goal
      .addCase(createGoal.fulfilled, (state, action) => {
        state.activeGoals.unshift(action.payload);
      })
      
      // update goal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const goal = action.payload;
        if (goal.isCompleted) {
          state.activeGoals = state.activeGoals.filter(g => g._id !== goal._id);
          const exists = state.completedGoals.some(g => g._id === goal._id);
          if (!exists) state.completedGoals.unshift(goal);
        } else {
          state.completedGoals = state.completedGoals.filter(g => g._id !== goal._id);
          state.activeGoals = state.activeGoals.map(g => g._id === goal._id ? goal : g);
        }
      })
      
      // delete goal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.activeGoals = state.activeGoals.filter(g => g._id !== action.payload);
        state.completedGoals = state.completedGoals.filter(g => g._id !== action.payload);
      })
      
      // breakdown goal
      .addCase(breakdownGoal.fulfilled, (state, action) => {
        state.activeGoals = state.activeGoals.map(g => {
          if (g._id === action.payload.id) {
            return { ...g, steps: action.payload.steps, progress: 0 };
          }
          return g;
        });
      })
      
      // fetch achievements
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload;
      })
      
      // fetch dreams
      .addCase(fetchDreams.fulfilled, (state, action) => {
        state.dreams = action.payload;
      })
      .addCase(createDream.fulfilled, (state, action) => {
        state.dreams.unshift(action.payload);
      })
      .addCase(updateDream.fulfilled, (state, action) => {
        state.dreams = state.dreams.map(d => d._id === action.payload._id ? action.payload : d);
      })
      .addCase(deleteDream.fulfilled, (state, action) => {
        state.dreams = state.dreams.filter(d => d._id !== action.payload);
      })
      
      // fetch dates
      .addCase(fetchDates.fulfilled, (state, action) => {
        state.dates = action.payload;
      })
      .addCase(createDate.fulfilled, (state, action) => {
        state.dates.push(action.payload);
        state.dates.sort((a, b) => new Date(a.date) - new Date(b.date));
      })
      .addCase(deleteDate.fulfilled, (state, action) => {
        state.dates = state.dates.filter(d => d._id !== action.payload);
      });
  }
});

export default goalSlice.reducer;