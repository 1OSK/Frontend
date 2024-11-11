import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';

const store = configureStore({
  reducer: {
    ourData: dataReducer,  // Подключаем редьюсер
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;