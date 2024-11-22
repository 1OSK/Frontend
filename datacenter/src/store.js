import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
const store = configureStore({
    reducer: {
        ourData: dataReducer,
    },
});
export default store;
