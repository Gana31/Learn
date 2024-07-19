import { createSlice } from "@reduxjs/toolkit";
import { setUser } from "./ProfileSlice";
// import { authApi } from "../Services/Operation/authApi";


const initialstate = {
    accessToken: localStorage.getItem("accessToken")|| '',
    user: JSON.parse(localStorage.getItem("user")!) || '',
};

const authSlice = createSlice({
    name : "auth",
    initialState:initialstate,
    reducers : {
          userLoggedIn(state, value) {
            state.accessToken = value.payload.accessToken;
            state.user = value.payload.user;
          },
        setToken(state,value){
          // console.log(value.payload);
            state.accessToken=value.payload.accessToken;
            state.user=value.payload.user;
        },
        setUserRegisterToken(state,value){
            state.accessToken=value.payload.accessToken;
        },
        clearAuthState(state){
          state.accessToken = '';
        },
        LogOutState(state){
          state.accessToken = '';
          state.user = '';
        },
        setuser(state,value){
          state.user = value.payload;
          localStorage.setItem("user",JSON.stringify(value.payload));
        }
    },
    extraReducers: (builder) => {
      builder.addCase(setUser, (state, action) => {
        state.user = action.payload;
      });
    },
    // extraReducers: (builder) => {
    //   builder
    //     .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
    //       state.accessToken = action.payload.accessToken;
    //     });
    // },
})

export const {setToken,userLoggedIn,clearAuthState,setUserRegisterToken,LogOutState,setuser} = authSlice.actions;
export default authSlice.reducer;