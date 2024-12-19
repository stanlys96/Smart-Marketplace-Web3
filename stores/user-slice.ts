import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newProduct: {
    productCode: "",
    type: "",
    name: "",
    price: 0,
    currency: ""
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNewProduct: (state, action) => {
      state.newProduct.productCode = action.payload.code;
      state.newProduct.name = action.payload.name;
      state.newProduct.type = action.payload.type;
      state.newProduct.price = action.payload.price;
      state.newProduct.currency = action.payload.currency;
    },
  },
});

const { actions, reducer } = userSlice;
export const {
  setNewProduct
} = actions;
export default reducer;