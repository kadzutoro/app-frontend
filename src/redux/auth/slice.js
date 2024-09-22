import { createSlice } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  updateUser,
  getCurrentUser,
  changeTheme,
  needHelp,
  terminateSessions,
} from './operations.js';

const handlePending = state => {
    state.isLoading = true;
}

const handleRejected = (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
};

const initialState = {
    user: {
        name: null,
        email: null,
        theme: null,
        avatar: null,
        oauth: false,
        sessions: [],
    },
    accessToken: null,
    refreshToken: null,
    isRefreshing: false,
    isLoggedIn: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    
    reducers: {
        addTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;

            if(action.payload.isRefreshing) state.isRefreshing = true;
        },
        deleteTokenAndLogOf: state => {
            state.user = initialState.user;
            state.accessToken = initialState.accessToken;
            state.refreshToken = initialState.refreshToken;
            state.isRefreshing = false;
            state.isLoggedIn = false
            state.isLoading = false;
            state.error = null;
        }
    },

    extraReducers: builder => {
        builder
        .addCase(register.pending, handlePending)
        .addCase(register.rejected, handleRejected)
        .addCase(register.fullfiled, (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isLoggedIn = true;
            state.isLoading = false;
            state.error = null;
        })
        .addCase(login.pending, handlePending)
        .addCase(login.rejected, handleRejected)
        .addCase(login.fullfiled, (state, action) => {
            state.user.email = action.payload.data.user.email;
            state.user.name = action.payload.data.user.name;
            state.user.theme = action.payload.data.user.theme;
            state.user.avatar = action.payload.data.user.avatar;
            state.user.sessions = action.payload.data.user.sessions;
            state.accessToken = action.payload.data.accessToken;
            state.refreshToken = action.payload.data.refreshToken;
            state.isLoggedIn = true;
            state.isLoading = false,
            state.error = null;
        })
        .addCase(logout.fullfiled, state => {
            state.user = initialState.user;
            state.accessToken = initialState.accessToken;
            state.refreshToken = initialState.refreshToken;
            state.isLoggedIn = false;
        })
        .addCase(getCurrentUser.pendin, handlePending)
        .addCase(getCurrentUser.rejected, handleRejected)
        .addCase(getCurrentUser.fullfiled, (state, action) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.isRefreshing = false;
        })
        .addCase(updateUser.fullfiled, (state, action) => {
            state.user.name = action.payload.data.user.name;
            state.user.email = action.payload.data.user.email;
            state.user.avatar = action.payload.data.user.avatar;
            state.user.sessions = action.payload.data.user.sessions;
            state.isLoading = false;
        })
        .addCase(changeTheme.fullfiled, (state, action) => {
            state.user.theme = action.payload.data.user.theme;
        })
        .addCase(needHelp.fullfiled, state => {
            state.isLoading = false;
        })
        .addCase(terminateSessions.fullfiled, (state, action) => {
            const deletedSessions = action.payload.sessions.map(s => s.id);

            state.user.sessions - state.user.sessions.filter(
                s => !deletedSessions.includes(s.id)
            );
            state.isLoading = false;
        })
    }
})

export const { addTokens, deleteTokenAndLogOf } = authSlice.actions;
export default authSlice.reducer;