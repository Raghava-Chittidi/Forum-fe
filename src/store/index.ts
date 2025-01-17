import { ThreadType } from "../types/types";
import { createSlice, configureStore } from "@reduxjs/toolkit";

export type authInfo = {
    access_token: string;
    refresh_token: string;
    userData: {
        id: number;
        email: string;
        username: string;
    } | null;
    isLoggedIn: boolean;
};

const initialAuthState: authInfo = {
    access_token: "",
    refresh_token: "",
    userData: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            const { tokenPair, userData } = action.payload;
            state.access_token = tokenPair.access_token;
            state.refresh_token = tokenPair.refresh_token;
            state.isLoggedIn = !!tokenPair.access_token;
            state.userData = userData;
        },
        logout(state) {
            state.access_token = "";
            state.refresh_token = "";
            state.isLoggedIn = false;
            state.userData = null;
        },
    },
});

export type threadSearch = {
    filter: string;
    searchInput: string;
};

const initialSearchState: threadSearch = {
    filter: "All",
    searchInput: "",
};

const searchSlice = createSlice({
    name: "search",
    initialState: initialSearchState,
    reducers: {
        setFilter(state, action) {
            return { ...state, filter: action.payload.filter };
        },
        setSearchInput(state, action) {
            return { ...state, searchInput: action.payload.searchInput };
        },
        reset() {
            return initialSearchState;
        },
    },
});

export type likeSliceObj = { id: number; liked: boolean; favourited: boolean };

const likeSlice = createSlice({
    name: "like",
    initialState: [] as likeSliceObj[],
    reducers: {
        init(state, action) {
            const threads: ThreadType[] = action.payload.threads;
            const username = action.payload.username;
            const len = threads.length;
            const res = [];

            for (let i = 0; i < len; i++) {
                const thread = threads[i];
                const likedBoolValue = thread.likes.findIndex((like) => like.user.username === username) !== -1;
                const favouritedBoolValue =
                    thread.favourites.findIndex((favourite) => favourite.user.username === username) !== -1;
                const likeObj = { id: thread.ID, liked: likedBoolValue, favourited: favouritedBoolValue };
                res.push(likeObj);
            }
            return res;
        },
        insert(state, action) {
            return [...state, { id: action.payload.id, liked: false, favourited: false }];
        },
        delete(state, action) {
            const res = state.filter((likeObj) => likeObj.id !== action.payload.id);
            return res;
        },
        setValue(state, action) {
            const index = state.findIndex((likeObj) => likeObj.id === action.payload.id);
            state[index] = action.payload;
            return state;
        },
    },
});

const store = configureStore({
    reducer: { auth: authSlice.reducer, search: searchSlice.reducer, like: likeSlice.reducer },
});

export const authActions = authSlice.actions;
export const searchActions = searchSlice.actions;
export const likeActions = likeSlice.actions;

export default store;
