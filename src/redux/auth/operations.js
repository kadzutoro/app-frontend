import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../utils/backendAPI';
import { setAuthHeader, clearAuthHeader, checkRefreshAuthTokens } from '../../utils/backendAPI';

export const register = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  try {
    const { data } = await axios.post('/users/register', credentials);
    setAuthHeader(data.data.accessToken);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const { data } = await axios.post('/users/login', credentials);
    setAuthHeader(data.data.accessToken);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    // check and refresh tokens
    const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
    if (!isValidTokens.status) throw isValidTokens.error;

    await axios.post('/users/logout');
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ credentials, isFormData }, thunkAPI) => {
    try {
      const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;

      const config = isFormData
        ? { hearders: { 'Content-Type': 'multipart/form-data' } }
        : { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.patch('/users/update', credentials, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, thunkAPI) => {
  try {
    const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
    if (!isValidTokens.status) throw isValidTokens.error;
    const { data } = await axios.get('/users/current');
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const changeTheme = createAsyncThunk('auth/userTheme', async (theme, thunkAPI) => {
  try {
    const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
    if (!isValidTokens.status) throw isValidTokens.error;
    const { data } = await axios.patch('/users/udpate', { theme });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const needHelp = createAsyncThunk('auth/needHelp', async ({ email, comment }, thunkAPI) => {
  try {
    const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
    if (!isValidTokens.status) throw isValidTokens.error;

    await axios.post('/users/need-help', { email, comment });
    return { email, comment };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const terminateSessions = createAsyncThunk('auth/terminateSessions',
  async (_, thunkAPI) => {
    try {
      const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;
      const { data } = await axios.post('/auth/close-sessions');
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)
