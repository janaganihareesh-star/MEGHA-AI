import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthConfig } from './authSlice';

const initialState = {
  notifications: [],
  isLoading: false,
  error: null
};

// THUNKS
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('/api/notifications', getAuthConfig(token));
      return res.data.notifications;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load notifications.');
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  'notification/markRead',
  async (ids, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.put('/api/notifications/read', { ids }, getAuthConfig(token));
      return ids; // array of read ids (or undefined to mark all read)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update notifications.');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`/api/notifications/${id}`, getAuthConfig(token));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove notification.');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      const exists = state.notifications.some(n => n._id === action.payload._id);
      if (!exists) {
        state.notifications.unshift(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        const ids = action.payload;
        if (ids && ids.length > 0) {
          state.notifications = state.notifications.map(n =>
            ids.includes(n._id) ? { ...n, isRead: true } : n
          );
        } else {
          state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;