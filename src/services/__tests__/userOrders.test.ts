import store from '../store';

import {
  userOrdersAction,
  userOrdersSelectors,
  initialState,
  getOrders
} from '../slices/userOrders';
import { getOrdersApi } from '../../utils/burger-api';

const mockOrdersResponse = [
  {
    _id: '1',
    ingredients: ['ingredient-1', 'ingredient-2'],
    status: 'done',
    name: 'Краторный био-марсианский бургер',
    createdAt: '2025-02-15T13:41:22.234Z',
    updatedAt: '2025-02-15T13:41:22.837Z',
    number: 68452
  }
];

jest.mock('../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

describe('тесты для userOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(userOrdersAction.resetOrders());
  });

  it('проверка initailState', () => {
    const state = store.getState().orders;
    expect(state).toEqual(initialState);
  });

  it('проверка getOrders.pending', () => {
    store.dispatch({ type: getOrders.pending.type });
    const state = store.getState().orders;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('проверка getOrders.fulfilled', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrdersResponse);
    await store.dispatch(getOrders());

    const state = store.getState().orders;
    expect(state.orders).toEqual(mockOrdersResponse);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(undefined);
  });

  it('проверка getOrders.rejected', async () => {
    const errorMessage = 'Failed to fetch';
    (getOrdersApi as jest.Mock).mockRejectedValue(errorMessage);

    await store.dispatch(getOrders());

    const state = store.getState().orders;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('проверка resetOrder', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrdersResponse);
    await store.dispatch(getOrders());
    store.dispatch(userOrdersAction.resetOrders());
    const state = store.getState().orders;
    expect(state).toEqual(initialState);
  });

  it('проверка селекторов', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(mockOrdersResponse);
    await store.dispatch(getOrders());

    const orders = userOrdersSelectors.selectOrders(store.getState());
    expect(orders).toEqual(mockOrdersResponse);

    const loading = userOrdersSelectors.selectOrdersLoadingStatus(
      store.getState()
    );
    expect(loading).toBe(false);

    const error = userOrdersSelectors.selectOrdersErrorStatus(store.getState());
    expect(error).toBe(undefined);
  });
});
