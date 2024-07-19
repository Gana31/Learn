import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./Services/Operation/authApi";
import authReducer from "./Slice/AuthSlice"
import profileReducer from "./Slice/ProfileSlice"
import courseReducer from "./Slice/CourseSlice"
import cartReducer from "./Slice/CartSlice"
import viewCourseReducer from './Slice/ViewCourseSlice'
export const store = configureStore({
    reducer:{
        auth : authReducer,
        profile : profileReducer,
        course : courseReducer,
        cart : cartReducer,
        viewCourse : viewCourseReducer,
        [authApi.reducerPath]:authApi.reducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;