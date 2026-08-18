import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSystemCategories } from '../services/categoryService';

export const fetchCategories = createAsyncThunk("category/fetch", async () => {
  const res = await getSystemCategories();
  return res.data;
});

const categorySlice = createSlice({
  name: "category",
  initialState: { categories: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.status = "loading"; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;