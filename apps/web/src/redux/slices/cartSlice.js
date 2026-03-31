const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    items:[],
    cartData: null
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addToCart(state, action){
            let product = action.payload
            if(!state.items.some(item => item.id === product.id)){
                state.items.push({...product, quantity: 1})
            }else{
                state.items = state.items.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item)
            }
        },
        setCart(state, action){
            console.log("Setting cart in Redux store:", action.payload)
            state.cartData = action.payload
        },

    }
})

export const { addToCart, setCart } = cartSlice.actions
export default cartSlice.reducer