import { createSlice } from "@reduxjs/toolkit";

interface ProfileState {
    user: any; // Define your user type appropriately
  }

  const initialState: ProfileState = {
    user: JSON.parse(localStorage.getItem("user")!) || '',
  };

const profileSlice = createSlice({
    name : "profile",
    initialState:initialState,
    reducers : {
        setUser(state,value){
            state.user=value.payload;
        },
        clearUser(state) {
            state.user ='';
            
          },
    }
})

export const {setUser,clearUser} = profileSlice.actions;
export default profileSlice.reducer;