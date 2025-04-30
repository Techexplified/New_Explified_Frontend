import {
    configureStore
} from '@reduxjs/toolkit';
import userReducer from "./auth_slice/UserSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    devTools: true, // Disable Redux DevTools
});