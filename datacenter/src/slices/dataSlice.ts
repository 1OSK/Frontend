import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface PriceState {
  minPrice: string;
  maxPrice: string;
}


const initialState: PriceState = {
  minPrice: '',
  maxPrice: '',
};


const dataSlice = createSlice({
  name: 'data',  
  initialState,
  reducers: {
    setMinPrice(state, action: PayloadAction<string>) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.maxPrice = action.payload;
    },
  },
});


export const { setMinPrice, setMaxPrice } = dataSlice.actions;


export default dataSlice.reducer;