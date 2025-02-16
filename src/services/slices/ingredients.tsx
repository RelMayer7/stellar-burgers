import { INGREDIENTS_SLICE_NAME } from './sliceNames';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

export const getIngredients = createAsyncThunk(
  `${INGREDIENTS_SLICE_NAME}/getIngredients`,
  async () => await getIngredientsApi()
);

interface IingredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | undefined;
}

export const initialState: IingredientsState = {
  ingredients: [],
  loading: false,
  error: undefined
};

const ingredientsSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {
    resetIngredients: (state) => {
      state.ingredients = [];
      state.loading = false;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading
  }
});

export const ingredientsAction = ingredientsSlice.actions;
export const ingredientsSelectors = ingredientsSlice.selectors;

export default ingredientsSlice;
