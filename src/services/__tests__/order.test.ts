import {
  postOrderBurger,
  orderAction,
  orderSelectors,
  initialState
} from '../slices/order';
import store from '../store';
import { expect, it, describe, jest } from '@jest/globals';

const mockOrderResponse = {
  order: {
    ingredients: ['ingredient-1', 'ingredient-2'],
    _id: '1',
    status: 'done',
    name: 'Краторный био-марсианский бургер',
    createdAt: '2025-02-15T13:41:22.234Z',
    updatedAt: '2025-02-15T13:41:22.837Z',
    number: 68452
  }
};

jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(() => {
    return Promise.resolve(mockOrderResponse);
  })
}));

describe('тесты для order', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(orderAction.resetOrder());
  });

  it('проверка initailState', () => {
    const state = store.getState().order;
    expect(state).toEqual(initialState);
  });

  it('проверка postOrderBurger.pending', () => {
    store.dispatch({ type: postOrderBurger.pending.type });
    const state = store.getState().order;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('проверка postOrderBurger.fulfilled', async () => {
    await store.dispatch(postOrderBurger(['ingredient-1', 'ingredient-2']));
    const state = store.getState().order;
    expect(state.order).toEqual(mockOrderResponse.order);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(undefined);
  });

  it('проверка postOrderBurger.rejected', () => {
    const errorMessage = 'Failed to fetch';
    store.dispatch({
      type: postOrderBurger.rejected.type,
      error: { message: errorMessage }
    });
    const state = store.getState().order;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('проверка resetOrder', () => {
    store.dispatch(orderAction.resetOrder());
    const state = store.getState().order;
    expect(state).toEqual(initialState);
  });

  it('проверка селекторов', async () => {
    await store.dispatch(postOrderBurger(['ingredient-1', 'ingredient-2']));

    const order = orderSelectors.selectOrder(store.getState());
    expect(order).toEqual(mockOrderResponse.order);

    const loading = orderSelectors.selectOrderLoadingStatus(store.getState());
    expect(loading).toBe(false);

    const error = orderSelectors.selectOrderErrorStatus(store.getState());
    expect(error).toBe(undefined);
  });
});
