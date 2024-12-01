import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; email?: string } | null; // Добавляем email в пользователя
  sessionId: string | null; // Добавляем sessionId
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionId: null, // Изначально sessionId отсутствует
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; sessionId: string }>) => {
      state.isAuthenticated = true;
      state.user = { username: action.payload.username };
      state.sessionId = action.payload.sessionId;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionId = null;
    },
    // Новый редьюсер для обновления информации пользователя
    updateUserInfo: (state, action: PayloadAction<{ email: string }>) => {
      if (state.user) {
        state.user.email = action.payload.email; // Обновляем email
      }
    },
  },
});

export const { login, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;