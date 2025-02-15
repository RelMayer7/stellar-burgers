import store from '../store';
import {
  burgerConstructorAction,
  burgerConstructorSelectors,
  initialState
} from '../slices/burgerConstructor';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn()
}));

const mockBun: TIngredient = {
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
};

const mockBunConstructor: TConstructorIngredient = {
  id: 'mockedId-1',
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
};

const mockIngredientFirst: TIngredient = {
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
};

const mockIngredientSecond: TIngredient = {
  _id: 'main-2',
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
};

const mockIngredientConstructorFirst: TConstructorIngredient = {
  id: 'mockedId-1',
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
};

const mockIngredientConstructorSecond: TConstructorIngredient = {
  id: 'mockedId-2',
  _id: 'main-2',
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
};

const mockIngredientConstructor: TConstructorIngredient = {
  id: 'mockedId-2',
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
};

describe('тесты для burgerConstructor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(burgerConstructorAction.removeIngedientsInOrder());
  });

  it('проверка initialState', () => {
    const state = store.getState().burgerConstructor;
    expect(state).toEqual(initialState);
  });

  it('проверка добавляения булки', () => {
    (nanoid as jest.Mock).mockReturnValue('mockedId-1');
    store.dispatch(burgerConstructorAction.addIngredient(mockBun));
    const state = store.getState().burgerConstructor;
    expect(state.data.bun).toEqual(mockBunConstructor);
  });

  it('проверка добавляения ингредиента', () => {
    (nanoid as jest.Mock).mockReturnValue('mockedId-2');
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientFirst));
    const state = store.getState().burgerConstructor;
    expect(state.data.ingredients).toEqual([mockIngredientConstructor]);
  });

  it('проверка removeIngredient', () => {
    (nanoid as jest.Mock).mockReturnValue('mockedId-2');
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientFirst));
    store.dispatch(
      burgerConstructorAction.removeIngredient(mockIngredientConstructor)
    );
    const state = store.getState().burgerConstructor;
    expect(state.data.ingredients).toEqual([]);
  });

  it('проверка moveIngredient', () => {
    (nanoid as jest.Mock)
      .mockReturnValueOnce('mockedId-1')
      .mockReturnValueOnce('mockedId-2');
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientFirst));
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientSecond));
    const ingredients = store.getState().burgerConstructor.data.ingredients;
    store.dispatch(
      burgerConstructorAction.moveIngredient({ index: 0, step: 1 })
    );
    const state = store.getState().burgerConstructor;
    expect(state.data.ingredients).toEqual([
      mockIngredientConstructorSecond,
      mockIngredientConstructorFirst
    ]);
  });

  it('проверка removeIngedientsInOrder', () => {
    (nanoid as jest.Mock)
      .mockReturnValueOnce('mockedId-1')
      .mockReturnValueOnce('mockedId-2');
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientFirst));
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientSecond));
    store.dispatch(burgerConstructorAction.removeIngedientsInOrder());
    const state = store.getState().burgerConstructor;
    expect(state.data.bun).toBe(null);
    expect(state.data.ingredients).toEqual([]);
  });

  it('проверка selectBurgerIngredients', () => {
    (nanoid as jest.Mock)
      .mockReturnValueOnce('mockedId-1')
      .mockReturnValueOnce('mockedId-2');
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientFirst));
    store.dispatch(burgerConstructorAction.addIngredient(mockIngredientSecond));
    const ingredients = burgerConstructorSelectors.selectBurgerIngredients(
      store.getState()
    );
    expect(ingredients).toEqual({
      bun: null,
      ingredients: [
        mockIngredientConstructorFirst,
        mockIngredientConstructorSecond
      ]
    });
  });
});
