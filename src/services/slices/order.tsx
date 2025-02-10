import { ORDER_SLICE_NAME } from './sliceNames';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export const postOrderBurger = createAsyncThunk(
  `${ORDER_SLICE_NAME}/postOrderBurger`,
  async (data: string[]) => await orderBurgerApi(data).then((data) => data)
);

export interface IOrderState {
  order: TOrder | null;
  loading: boolean;
  error: string | undefined;
}

export const initialState: IOrderState = {
  order: null,
  loading: false,
  error: undefined
};

export const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = undefined;
    }
  },
  selectors: {
    selectOrderLoadingStatus: (state) => state.loading,
    selectOrderErrorStatus: (state) => state.error,
    selectOrder: (state) => state.order
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrderBurger.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(postOrderBurger.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
      })
      .addCase(postOrderBurger.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export const orderAction = orderSlice.actions;
export const orderSelectors = orderSlice.selectors;

export default orderSlice;
