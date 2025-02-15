import store from '../store';
import {
  getFeeds,
  getOrderByNumber,
  feedsSelectors,
  initialState,
  feedsAction
} from '../slices/feeds';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';

const mockFeedsResponse = {
  orders: [
    {
      _id: '67b08c67133acd001be51065',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2025-02-15T12:45:27.147Z',
      updatedAt: '2025-02-15T12:45:27.757Z',
      number: 68445
    }
  ],
  total: 68071,
  totalToday: 31
};

const mockOrderByNumberResponse = {
  orders: [
    {
      _id: '67b08c67133acd001be51065',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
      owner: '67afa7cb133acd001be50e0e',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2025-02-15T12:45:27.147Z',
      updatedAt: '2025-02-15T12:45:27.757Z',
      number: 68445,
      __v: 0
    }
  ]
};

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('тесты для feedds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(feedsAction.resetFeeds());
  });

  it('проверка initailState', () => {
    const state = store.getState().feeds;
    expect(state).toEqual(initialState);
  });

  it('проверка getFeeds.pending', () => {
    store.dispatch({ type: getFeeds.pending.type });
    const state = store.getState().feeds;
    expect(state.feedsLoading).toBe(true);
    expect(state.feedsError).toBe(undefined);
  });

  it('проверка getFeeds.fulfilled', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsResponse);
    await store.dispatch(getFeeds());

    const state = store.getState().feeds;
    expect(state.feeds).toEqual(mockFeedsResponse.orders);
    expect(state.total).toBe(mockFeedsResponse.total);
    expect(state.totalToday).toBe(mockFeedsResponse.totalToday);
    expect(state.feedsLoading).toBe(false);
    expect(state.feedsError).toBe(undefined);
  });

  it('проверка getFeeds.rejected', async () => {
    const errorMessage = 'Failed to fetch';
    (getFeedsApi as jest.Mock).mockRejectedValue(errorMessage);
    await store.dispatch(getFeeds());
    const state = store.getState().feeds;
    expect(state.feedsLoading).toBe(false);
    expect(state.feedsError).toBe(errorMessage);
  });

  it('проверка getOrderByNumber.pending', () => {
    store.dispatch({ type: getOrderByNumber.pending.type });
    const state = store.getState().feeds;
    expect(state.orderLoading).toBe(true);
    expect(state.orderError).toBe(undefined);
  });

  it('проверка getOrderByNumber.fulfilled', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue(
      mockOrderByNumberResponse
    );
    await store.dispatch(getOrderByNumber(1));
    const state = store.getState().feeds;
    expect(state.order).toEqual(mockOrderByNumberResponse.orders[0]);
    expect(state.orderLoading).toBe(false);
    expect(state.orderError).toBe(undefined);
  });

  it('проверка getOrderByNumber.rejected', async () => {
    const errorMessage = 'Failed to fetch order';
    (getOrderByNumberApi as jest.Mock).mockRejectedValue(errorMessage);
    await store.dispatch(getOrderByNumber(1));
    const state = store.getState().feeds;
    expect(state.orderLoading).toBe(false);
    expect(state.orderError).toBe(errorMessage);
  });

  it('проверка resetFeeds', () => {
    store.dispatch(feedsAction.resetFeeds());
    const state = store.getState().feeds;
    expect(state).toEqual(initialState);
  });

  it('проверка селекторов', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsResponse);
    await store.dispatch(getFeeds());

    (getOrderByNumberApi as jest.Mock).mockResolvedValue(
      mockOrderByNumberResponse
    );
    await store.dispatch(getOrderByNumber(1));

    const orders = feedsSelectors.selectOrders(store.getState());
    expect(orders).toEqual(mockFeedsResponse.orders);

    const total = feedsSelectors.selectTotal(store.getState());
    expect(total).toBe(mockFeedsResponse.total);

    const totalToday = feedsSelectors.selectTotalToday(store.getState());
    expect(totalToday).toBe(mockFeedsResponse.totalToday);

    const feedsLoading = feedsSelectors.selectFeedsLoadingStatus(
      store.getState()
    );
    expect(feedsLoading).toBe(false);

    const feedsError = feedsSelectors.selectFeedsError(store.getState());
    expect(feedsError).toBe(undefined);

    const order = feedsSelectors.selectOrder(store.getState());
    expect(order).toEqual(mockOrderByNumberResponse.orders[0]);

    const orderLoading = feedsSelectors.selectOrderLoadingStatus(
      store.getState()
    );
    expect(orderLoading).toBe(false);

    const orderError = feedsSelectors.selectOrderError(store.getState());
    expect(orderError).toBe(undefined);
  });
});
