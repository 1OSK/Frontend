import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
  sessionId: string | null; // Добавляем поле для хранения sessionId
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
      state.sessionId = action.payload.sessionId; // Сохраняем sessionId при логине
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionId = null; // Очищаем sessionId при выходе
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;