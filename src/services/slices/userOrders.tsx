import { ORDERS_SLICE_NAME } from './sliceNames';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//import { getOrdersApi } from '@api';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const getOrders = createAsyncThunk(
  `${ORDERS_SLICE_NAME}/getOrders`,
  async () => await getOrdersApi()
);

export interface IOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | undefined;
}

export const initialState: IOrdersState = {
  orders: [],
  loading: false,
  error: undefined
};

export const userOrdersSlice = createSlice({
  name: ORDERS_SLICE_NAME,
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectOrdersLoadingStatus: (state) => state.loading,
    selectOrdersErrorStatus: (state) => state.error,
    selectOrders: (state) => state.orders
  }
});

export const userOrdersAction = userOrdersSlice.actions;
export const userOrdersSelectors = userOrdersSlice.selectors;

export default userOrdersSlice;
