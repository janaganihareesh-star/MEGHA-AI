import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import voiceReducer from './voiceSlice';
import memoryReducer from './memorySlice';
import goalReducer from './goalSlice';
import notificationReducer from './notificationSlice';
import settingsReducer from './settingsSlice';
import profileReducer from './profileSlice';
import learningReducer from './learningSlice';
import interviewReducer from './interviewSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    chat: chatReducer,
    voice: voiceReducer,
    memory: memoryReducer,
    goal: goalReducer,
    notification: notificationReducer,
    settings: settingsReducer,
    profile: profileReducer,
    learning: learningReducer,
    interview: interviewReducer
  }
});

export default store;
