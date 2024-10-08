import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axios from '../../utils/backendAPI';
import { checkRefreshAuthTokens } from '../../utils/backendAPI';

export const fetchBoards = createAsyncThunk('boards/fetchBoards', 
    async (_, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
            if(!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.get('/boards')
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const fetchOneBoard = createAsyncThunk('boards/fetchOneBoard',
    async(id, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
            if(!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.get(`/boards/${id}`)
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const addBoard = createAsyncThunk('boards/addBoard',
    async (newBoard, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;
      const { data } = await axios.post('/boards', { ...newBoard })
      return data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const editBoard = createAsyncThunk('boards/editBoard',
    async ({ id, name, icon, background }, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;
      const { data } = await axios.patch(`/boards/${id}`, {
        name,
        icon,
        background,
      })
      return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const deleteBoard = createAsyncThunk('boards/deleteBoard', 
    async (id, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.delete(`/boards/${id}`)
            localStorage.removeItem('activeBoardId');
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const createColumn = createAsyncThunk('columns/createColumn',
    async (newColumn, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;
      const { data } = await axios.post('/columns', { ...newColumn });
      return data.data;
        } catch (error) {
            const errorMessage = error.response.data.message || error.message;
            toast.error(`Error: ${errorMessage}`);
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const editColumn = createAsyncThunk('columns/editColumn',
    async ({ id, name }, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
      if (!isValidTokens.status) throw isValidTokens.error;
      const { data } = await axios.patch(`/columns/${id}`, {name});
      return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const deleteColumn = createAsyncThunk('columns/deleteColumn',
    async (id, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
            if(!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.delete(`/columns/${id}`)
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const createTask = createAsyncThunk('tasks/createTask',
    async (newTask, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
            if(!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.post('/tasks', { ...newTask })
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const editTask = createAsyncThunk('tasks/editTask',
    async ({ id, ...changes },thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
            if(!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.patch(`/tasks/${id}`, { ...changes })
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const moveTask = createAsyncThunk(
    'tasks/moveTask',
    async ({ taskId, fromColumnId, toColumnId }, thunkAPI) => {
      try {
        // check and refresh tokens
        const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
        if (!isValidTokens.status) throw isValidTokens.error;
  
        const { data } = await axios.patch(`/tasks/${taskId}/move`, {
          fromColumnId,
          toColumnId,
        });
        return data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

export const deleteTask = createAsyncThunk('tasks/deleteTask',
    async(id, thunkAPI) => {
        try {
            const isValidTokens = await checkRefreshAuthTokens(thunkAPI);
            if(!isValidTokens.status) throw isValidTokens.error;
            const { data } = await axios.delete(`/tasks/${id}`);
            return data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)