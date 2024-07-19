import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialstate = {
    cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")!)
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total")!)
    : 0,
  totalItem: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems")!)
    : 0,
};

const cartSlice = createSlice({
    name : "cart",
    initialState:initialstate,
    reducers : {
      addToCart: (state : any, action) => {
        const course = action.payload
        // console.log("addTocart couses",action)
        // console.log("addTocart couses",course)
        const index = state.cart.findIndex((item : any) => item._id === course._id)
          
        if (index >= 0) {
          // If the course is already in the cart, do not modify the quantity
          toast.error("Course already in cart")
          return
        }
        // If the course is not in the cart, add it to the cart
        state.cart.push(course)
        // Update the total quantity and price
        state.totalItem++
        state.total += course.price
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItem))
        // show toast
        toast.success("Course added to cart")
      },
      removeFromCart: (state : any, action) => {
        const courseId = action.payload
        const index = state.cart.findIndex((item : any) => item._id === courseId)
  
        if (index >= 0) {
          // If the course is found in the cart, remove it
          state.totalItem--
          state.total -= state.cart[index].price
          state.cart.splice(index, 1)
          // Update to localstorage
          localStorage.setItem("cart", JSON.stringify(state.cart))
          localStorage.setItem("total", JSON.stringify(state.total))
          localStorage.setItem("totalItems", JSON.stringify(state.totalItem))
          // show toast
          toast.success("Course removed from cart")
        }
      },
      resetCart: (state : any) => {
        state.cart = []
        state.total = 0
        state.totalItems = 0
        // Update to localstorage
        localStorage.removeItem("cart")
        localStorage.removeItem("total")
        localStorage.removeItem("totalItems")
      },
        setTotalItems(state,value){
            state.totalItem=value.payload;
        },
    }
})

export const {setTotalItems , resetCart,removeFromCart,addToCart} = cartSlice.actions;
export default cartSlice.reducer;