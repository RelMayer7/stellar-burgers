import {
  getIngredients,
  ingredientsSelectors,
  initialState,
  ingredientsAction
} from '../slices/ingredients';
import store from '../store';
import { expect, it, describe, jest } from '@jest/globals';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(() => {
    return Promise.resolve(mockIngredients);
  })
}));

describe('тесты для ingredients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(ingredientsAction.resetIngredients());
  });

  it('проверка initailState', () => {
    const state = store.getState().ingredients;
    expect(state).toEqual(initialState);
  });

  it('проверка getIngredients.pending', () => {
    store.dispatch({ type: getIngredients.pending.type });
    const state = store.getState().ingredients;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(undefined);
  });

  it('проверка getIngredients.fullfilded', async () => {
    await store.dispatch(getIngredients());
    const state = store.getState().ingredients;
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(undefined);
  });

  it('проверка getIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch';
    store.dispatch({
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    });
    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('проверка resetIngredients', async () => {
    await store.dispatch(getIngredients());
    store.dispatch(ingredientsAction.resetIngredients());
    const state = store.getState().ingredients;
    expect(state).toEqual(initialState);
  });

  it('проверка селекторов', async () => {
    await store.dispatch(getIngredients());
    const ingredients = ingredientsSelectors.selectIngredients(
      store.getState()
    );
    const loading = ingredientsSelectors.selectLoading(store.getState());
    expect(ingredients).toEqual(mockIngredients);
    expect(loading).toBe(false);
  });
});
