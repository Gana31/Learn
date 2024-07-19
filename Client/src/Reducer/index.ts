import { combineReducers } from "@reduxjs/toolkit";
import authReducer from"../Slice/AuthSlice"
import profileReducer from "../Slice/ProfileSlice";
import cartReducer from "../Slice/CartSlice";

const rootReducer = combineReducers({
    auth : authReducer,
    profile : profileReducer,
    cart : cartReducer
})

export default rootReducer