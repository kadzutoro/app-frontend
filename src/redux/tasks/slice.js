import { createSlice } from '@reduxjs/toolkit';
import {
  addBoard,
  createColumn,
  createTask,
  deleteBoard,
  deleteColumn,
  deleteTask,
  editBoard,
  editColumn,
  editTask,
  fetchBoards,
  fetchOneBoard,
} from './operations';
import { logout } from '../auth/operations';
import { setFilterPriority } from '../filters/slice';
import { selectNextBoard } from './selectors';

const handlePending = state => {
  state.loading = true;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const slice = createSlice({
  name: 'tasks',
  initialState: {
    board: [],
    backgroundLogos: [],
    selectedBoard: null,
    activeBoardId: null,
    columns: [],
    tasks: [],
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(setFilterPriority, (state, action) => {
        state.filterPriority = action.payload;
      })
      .addCase(fetchBoards.pending, handlePending)
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.board = action.payload.boards;
        state.backgroundLogos = action.payload.backgroundLogos;
      })
      .addCase(fetchBoards.rejected, handleRejected)
      .addCase(fetchOneBoard.pending, handlePending)
      .addCase(fetchOneBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.activeBoardId = action.payload.board.id;
        state.selectedBoard = action.payload.board;
        state.columns = action.payload.columns;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchOneBoard.rejected, handleRejected)
      .addCase(addBoard.pending, handlePending)
      .addCase(addBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.board.push(action.payload.board);
        state.selectedBoard = action.payload.board;
        state.activeBoardId = action.payload.board.id;
      })
      .addCase(addBoard.rejected, handleRejected)
      .addCase(editBoard.pending, handlePending)
      .addCase(editBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const itemIndex = state.board.findIndex(
          board => board.id === action.payload.board.id
        );
        state.board[itemIndex] = action.payload.board;
        state.selectedBoard = action.payload.board;
        state.activeBoardId = action.payload.board.id;
      })
      .addCase(editBoard.rejected, handleRejected)
      .addCase(deleteBoard.pending, handlePending)
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.activeBoardId === action.payload.board.id) {
          const nextBoard = selectNextBoard({ tasks: state });
          if (nextBoard) {
            state.activeBoardId = nextBoard.id;
            state.selectedBoard = nextBoard;
          }
        } else {
          state.activeBoardId = null;
          state.selectedBoard = null;
        }
        state.board = state.board.filter(
          item => item.id !== action.payload.board.id
        );
        state.columns = [];
        state.tasks = [];
      })
      .addCase(deleteBoard.rejected, handleRejected)
      .addCase(createColumn.pending, handlePending)
      .addCase(createColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.columns.push(action.payload.column);
      })
      .addCase(createColumn.rejected, handleRejected)
      .addCase(editColumn.pending, handlePending)
      .addCase(editColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const columnIndex = state.columns.findIndex(
          column => column.id === action.payload.column.id
        );
        state.columns[columnIndex] = action.payload.column;
      })
      .addCase(editColumn.rejected, handleRejected)
      .addCase(deleteColumn.pending, handlePending)
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.columns = state.columns.filter(
          column => column.id !== action.payload.column.id
        );
      })
      .addCase(deleteColumn.rejected, handleRejected)
      .addCase(createTask.pending, handlePending)
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks.push(action.payload.task);
      })
      .addCase(createTask.rejected, handleRejected)
      .addCase(editTask.pending, handlePending)
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const taskIndex = state.tasks.findIndex(
          task => task.id === action.payload.task.id
        );
        state.tasks[taskIndex] = action.payload.task;
      })
      .addCase(editTask.rejected, handleRejected)
      .addCase(deleteTask.pending, handlePending)
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks = state.tasks.filter(
          task => task.id !== action.payload.task.id
        );
      })
      .addCase(deleteTask.rejected, handleRejected)
      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.board = [];
        state.backgroundLogos = [];
        state.selectedBoard = null;
        state.activeBoardId = null;
        state.columns = [];
        state.tasks = [];
      })
      .addCase(logout.rejected, handleRejected);
  },
});

export default slice.reducer;