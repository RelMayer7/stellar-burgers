import { CONSTRUCTOR_SLICE_NAME } from './sliceNames';
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

import { TConstructorIngredient, TIngredient } from '@utils-types';

interface IBurgerConstructorState {
  data: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

export const initialState: IBurgerConstructorState = {
  data: {
    bun: null,
    ingredients: []
  }
};

const burgerConstructorSlice = createSlice({
  name: CONSTRUCTOR_SLICE_NAME,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.data.bun = action.payload;
        } else {
          state.data.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action) => {
      state.data.ingredients = state.data.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    moveIngredient: (state, action) => {
      const { index, step } = action.payload;
      const per = state.data.ingredients[index];
      state.data.ingredients[index] = state.data.ingredients[index + step];
      state.data.ingredients[index + step] = per;
    },
    removeIngedientsInOrder: (state) => {
      state.data.ingredients = [];
      state.data.bun = null;
    }
  },
  selectors: {
    selectBurgerIngredients: (state) => state.data
  }
});

export const burgerConstructorAction = burgerConstructorSlice.actions;
export const burgerConstructorSelectors = burgerConstructorSlice.selectors;

export default burgerConstructorSlice;
