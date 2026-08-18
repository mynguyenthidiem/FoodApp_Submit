import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getCart,
  addToCart,
  updateCart,
  removeCart,
  clearCart,
} from '../services/cartService';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await getCart();
});

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ foodId, quantity }, { dispatch }) => {
    await addToCart({
      foodId,
      quantity,
    });

    await dispatch(fetchCart()).unwrap();

    return true;
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, { dispatch }) => {
    await updateCart({
      id,
      quantity,
    });

    await dispatch(fetchCart()).unwrap();

    return true;
  },
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id, { dispatch }) => {
    await removeCart(id);

    await dispatch(fetchCart()).unwrap();

    return true;
  },
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { dispatch }) => {
    await clearCart();

    await dispatch(fetchCart()).unwrap();

    return true;
  },
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    clearCartState(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder

  
  
  

      .addCase(fetchCart.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.items ?? [];

        state.error = null;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  
  
  

      .addCase(addCartItem.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(addCartItem.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })

      .addCase(addCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  
  
  

      .addCase(updateCartItem.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(updateCartItem.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  
  
  

      .addCase(removeCartItem.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(removeCartItem.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  
  
  

      .addCase(clearCartAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(clearCartAsync.fulfilled, state => {
        state.status = 'succeeded';
        state.error = null;
      })

      .addCase(clearCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
