import store from '../store';
import userSlice, {
  userSelectors,
  initialState,
  loginUser,
  registerUser,
  logoutUser,
  getUser,
  updateUser
} from '../slices/user';

const user = {
  name: 'testUser',
  email: 'test@gmail.com'
};

const mockState = {
  user: {
    isAuthenticated: true,
    loginUserRequest: false,
    user: user,
    error: undefined
  }
};

const errorState = {
  user: {
    isAuthenticated: true,
    loginUserRequest: false,
    user: user,
    error: 'Failed to fetch'
  }
};

describe('тесты для user', () => {
  it('проверка initailStateStore', () => {
    const state = store.getState().user;
    expect(state).toEqual(initialState);
  });

  it('проверка initailState', () => {
    const newState = userSlice.reducer(undefined, { type: 'UnknownAction' });
    expect(newState).toEqual(initialState);
  });

  it('проверка registerUser.pending', () => {
    const newState = userSlice.reducer(initialState, {
      type: registerUser.pending.type
    });
    expect(newState.loginUserRequest).toBe(true);
    expect(newState.isAuthenticated).toBe(false);
  });

  it('проверка registerUser.fulfilled', () => {
    const newState = userSlice.reducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: user
    });
    expect(newState.user).toEqual(user);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.loginUserRequest).toBe(false);
  });

  it('проверка registerUser.rejected', () => {
    const errorMessage = 'Failed to fetch';
    const newState = userSlice.reducer(initialState, {
      type: registerUser.rejected.type,
      error: { message: errorMessage }
    });
    expect(newState.error).toBe(errorMessage);
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.isAuthenticated).toBe(false);
  });

  it('проверка loginUser.pending', () => {
    const newState = userSlice.reducer(initialState, {
      type: loginUser.pending.type
    });
    expect(newState.loginUserRequest).toBe(true);
    expect(newState.isAuthenticated).toBe(false);
  });

  it('проверка loginUser.fulfilled', () => {
    const newState = userSlice.reducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: user
    });
    expect(newState.user).toEqual(user);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.error).toBe(undefined);
  });

  it('проверка loginUser.rejected', () => {
    const errorMessage = 'Failed to fetch';
    const newState = userSlice.reducer(initialState, {
      type: loginUser.rejected.type,
      error: { message: errorMessage }
    });
    expect(newState.error).toBe(errorMessage);
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.isAuthenticated).toBe(false);
  });

  it('проверка logoutUser.pending', () => {
    const newState = userSlice.reducer(initialState, {
      type: logoutUser.pending.type
    });
    expect(newState.isAuthenticated).toBe(false);
  });

  it('проверка logoutUser.fulfilled', () => {
    const newState = userSlice.reducer(initialState, {
      type: logoutUser.fulfilled.type
    });
    expect(newState.user).toEqual(initialState.user);
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.error).toBe(undefined);
  });

  it('проверка getUser.pending', () => {
    const newState = userSlice.reducer(initialState, {
      type: getUser.pending.type
    });
    expect(newState.loginUserRequest).toBe(true);
  });

  it('проверка getUser.fulfilled', () => {
    const newState = userSlice.reducer(initialState, {
      type: getUser.fulfilled.type,
      payload: { user }
    });
    expect(newState.user).toEqual(user);
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.error).toBe(undefined);
  });

  it('проверка getUser.rejected', () => {
    const errorMessage = 'Failed to fetch';
    const newState = userSlice.reducer(initialState, {
      type: getUser.rejected.type,
      error: { message: errorMessage }
    });
    expect(newState.error).toBe(errorMessage);
    expect(newState.loginUserRequest).toBe(false);
  });

  it('проверка updateUser.pending', () => {
    const newState = userSlice.reducer(initialState, {
      type: updateUser.pending.type
    });
    expect(newState.loginUserRequest).toBe(true);
  });

  it('проверка updateUser.fulfilled', () => {
    const newState = userSlice.reducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: { user }
    });
    expect(newState.user).toEqual(user);
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.error).toBe(undefined);
  });

  it('проверка updateUser.rejected', () => {
    const errorMessage = 'Failed to fetch';
    const newState = userSlice.reducer(initialState, {
      type: updateUser.rejected.type,
      error: { message: errorMessage }
    });
    expect(newState.error).toBe(errorMessage);
    expect(newState.loginUserRequest).toBe(false);
  });

  it('проверка селекторов', () => {
    const user = userSelectors.selectUser(mockState);
    expect(user).toEqual(mockState.user.user);

    const isAuthenticated = userSelectors.selectIsAuthenticated(mockState);
    expect(isAuthenticated).toBe(true);

    const loginUserRequest = userSelectors.selectLoginUserRequest(mockState);
    expect(loginUserRequest).toBe(false);

    const error = userSelectors.selectError(mockState);
    expect(error).toBeUndefined();

    const userError = userSelectors.selectError(errorState);
    expect(userError).toBe(errorState.user.error);
  });
});
