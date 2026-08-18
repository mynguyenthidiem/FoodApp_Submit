import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getFoods,
  getFoodById,
  getFoodsByCategory,
  searchFoods,
} from '../services/foodService';

export const fetchFoods = createAsyncThunk(
  'food/fetchFoods',
  async ({ pageNumber = 1, pageSize = 100 } = {}) => {
    return await getFoods(pageNumber, pageSize);
  },
);

export const fetchFoodById = createAsyncThunk(
  'food/fetchFoodById',
  async id => {
    return await getFoodById(id);
  },
);

export const fetchSearchFoods = createAsyncThunk(
  'food/fetchSearchFoods',
  async ({ keyword = '', pageNumber = 1, pageSize = 20 } = {}) => {
    return await searchFoods(keyword, pageNumber, pageSize);
  },
);

export const fetchFoodsByCategory = createAsyncThunk(
  'food/fetchFoodsByCategory',
  async ({ categoryId, pageNumber = 1, pageSize = 20 }) => {
    return await getFoodsByCategory(categoryId, pageNumber, pageSize);
  },
);

const initialState = {
  items: [],

  pageNumber: 1,
  totalPages: 1,
  totalCount: 0,

  searchResults: [],

  food: null,
  relatedFoods: [],

  status: 'idle',
  error: null,
};

const foodSlice = createSlice({
  name: 'food',

  initialState,

  reducers: {
    clearFoodDetail(state) {
      state.food = null;
      state.relatedFoods = [];
    },

    clearSearchResults(state) {
      state.searchResults = [];
    },
  },

  extraReducers: builder => {
    builder

  
  
  

      .addCase(fetchFoods.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = action.payload?.items ?? [];

        state.pageNumber = action.payload?.pageNumber ?? 1;

        state.totalPages = action.payload?.totalPages ?? 1;

        state.totalCount = action.payload?.totalCount ?? state.items.length;

        state.error = null;
      })

      .addCase(fetchFoods.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  
  
  

      .addCase(fetchFoodById.pending, state => {
        state.status = 'loading';
        state.food = null;
        state.error = null;
      })

      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.food = action.payload;
        state.error = null;
      })

      .addCase(fetchFoodById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

  
  
  

      .addCase(fetchFoodsByCategory.pending, state => {
        state.relatedFoods = [];
      })

      .addCase(fetchFoodsByCategory.fulfilled, (state, action) => {
        const items = action.payload?.items ?? [];

        if (state.food) {
          state.relatedFoods = items.filter(item => item.id !== state.food.id);
        } else {
          state.relatedFoods = items;
        }
      })

      .addCase(fetchFoodsByCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })

  
  
  

      .addCase(fetchSearchFoods.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchSearchFoods.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.searchResults = action.payload?.items ?? [];

        state.error = null;
      })

      .addCase(fetchSearchFoods.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearFoodDetail, clearSearchResults } = foodSlice.actions;

export default foodSlice.reducer;
