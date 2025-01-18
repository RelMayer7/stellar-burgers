import { USER_SLICE_NAME } from './sliceNames';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';

import { TUser } from '@utils-types';

export const registerUser = createAsyncThunk(
  `${USER_SLICE_NAME}/registerUser`,
  async (data: TRegisterData) =>
    registerUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

export const loginUser = createAsyncThunk(
  `${USER_SLICE_NAME}/loginUser`,
  async (data: TLoginData) =>
    await loginUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    })
);

export const forgotPassword = createAsyncThunk(
  `${USER_SLICE_NAME}/forgotPassword`,
  async (data: { email: string }) =>
    forgotPasswordApi(data).then((data) => data.success)
);

export const resetPassword = createAsyncThunk(
  `${USER_SLICE_NAME}/resetPassword`,
  async (data: { token: string; password: string }) =>
    resetPasswordApi(data).then((data) => data.success)
);

export const getUser = createAsyncThunk(
  `${USER_SLICE_NAME}/getUser`,
  async () => getUserApi()
);

export const updateUser = createAsyncThunk(
  `${USER_SLICE_NAME}/updateUser`,
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const logoutUser = createAsyncThunk(
  `${USER_SLICE_NAME}/logout`,
  async (_, { dispatch }) =>
    logoutApi()
      .then(() => {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(userAction.userLogout());
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      })
);

export interface IUserState {
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  user: TUser;
  error: string | undefined;
}

export const initialState: IUserState = {
  isAuthenticated: false,
  loginUserRequest: false,
  user: {
    name: '',
    email: ''
  },
  error: undefined
};

export const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    userLogout: (state) => {
      (state.user.name = ''), (state.user.email = '');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginUserRequest = false;
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginUserRequest = false;
        state.error = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.error = undefined;
        state.loginUserRequest = false;
      })
      .addCase(getUser.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.error = undefined;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.error = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.error = undefined;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.error = undefined;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectLoginUserRequest: (state) => state.loginUserRequest,
    selectError: (state) => state.error
  }
});

export const userAction = userSlice.actions;
export const userSelectors = userSlice.selectors;

export default userSlice;
