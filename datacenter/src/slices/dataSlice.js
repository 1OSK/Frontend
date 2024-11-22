import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    minPrice: '',
    maxPrice: '',
};
const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setMinPrice(state, action) {
            state.minPrice = action.payload;
        },
        setMaxPrice(state, action) {
            state.maxPrice = action.payload;
        },
    },
});
export const { setMinPrice, setMaxPrice } = dataSlice.actions;
export default dataSlice.reducer;
