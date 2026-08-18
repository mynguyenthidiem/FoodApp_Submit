import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getCart,
  addToCart,
  updateCart,
  removeCart,
  clearCart,
} from '../services/cartService';

// ======================================
// GET CART
// ======================================

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await getCart();
});

// ======================================
// ADD
// ======================================

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

// ======================================
// UPDATE
// ======================================

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

// ======================================
// DELETE
// ======================================

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id, { dispatch }) => {
    await removeCart(id);

    await dispatch(fetchCart()).unwrap();

    return true;
  },
);

// ======================================
// CLEAR
// ======================================

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { dispatch }) => {
    await clearCart();

    await dispatch(fetchCart()).unwrap();

    return true;
  },
);

// ======================================
// INITIAL STATE
// ======================================

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

// ======================================
// SLICE
// ======================================

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

      // ==================================
      // FETCH
      // ==================================

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

      // ==================================
      // ADD
      // ==================================

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

      // ==================================
      // UPDATE
      // ==================================

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

      // ==================================
      // DELETE
      // ==================================

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

      // ==================================
      // CLEAR
      // ==================================

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
