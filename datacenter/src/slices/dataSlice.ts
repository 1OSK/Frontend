import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceState {
  minPrice: string;
  maxPrice: string;
  datacentersCount: number;
  draftOrderId: number | null;
}

const initialState: PriceState = {
  minPrice: '',
  maxPrice: '',
  datacentersCount: 0,
  draftOrderId: null,
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
    setDatacentersCount(state, action: PayloadAction<number>) {
      state.datacentersCount = action.payload;
    },
    setDraftOrderId(state, action: PayloadAction<number | null>) {
      state.draftOrderId = action.payload;
    },
    resetDataState(state) {
      state.datacentersCount = 0;
      state.draftOrderId = null;
    },
  },
});

export const { 
  setMinPrice, 
  setMaxPrice, 
  setDatacentersCount, 
  setDraftOrderId, 
  resetDataState 
} = dataSlice.actions;

export default dataSlice.reducer;