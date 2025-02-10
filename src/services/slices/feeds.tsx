import { FEEDS_SLICE_NAME } from './sliceNames';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk(
  `${FEEDS_SLICE_NAME}/getFeeds`,
  async () => await getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  `${FEEDS_SLICE_NAME}/getOrderByNumber`,
  async (data: number) => await getOrderByNumberApi(data)
);

export interface IFeedsState {
  feeds: TOrder[];
  total: number;
  totalToday: number;
  feedsLoading: boolean;
  feedsError: string | undefined;
  order: TOrder | null;
  orderLoading: boolean;
  orderError: string | undefined;
}

const initialState: IFeedsState = {
  feeds: [],
  total: 0,
  totalToday: 0,
  feedsLoading: false,
  feedsError: undefined,
  order: null,
  orderLoading: false,
  orderError: undefined
};

const feedsSlice = createSlice({
  name: FEEDS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.feedsLoading = true;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.feedsLoading = false;
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.feedsLoading = false;
        state.feedsError = action.error.message;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.order = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.error.message;
      });
  },
  selectors: {
    selectOrders: (state) => state.feeds,
    selectFeedsLoadingStatus: (state) => state.feedsLoading,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectFeedsError: (state) => state.feedsError,
    selectOrderError: (state) => state.orderError,
    selectOrder: (state) => state.order,
    selectOrderLoadingStatus: (state) => state.orderLoading
  }
});

export const feedsAction = feedsSlice.actions;
export const feedsSelectors = feedsSlice.selectors;

export default feedsSlice;
