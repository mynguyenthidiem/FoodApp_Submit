import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getAllRestaurants,
  getRestaurantById,
  searchRestaurants,
  getTopRatedRestaurants,
  getOpenNowRestaurants,
} from '../services/restaurantService';

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    return await getAllRestaurants(pageNumber, pageSize);
  },
);


export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchRestaurantById',
  async id => {
    return await getRestaurantById(id);
  },
);


export const searchRestaurantsAsync = createAsyncThunk(
  'restaurant/searchRestaurants',
  async ({ keyword, pageNumber = 1, pageSize = 20 }) => {
    return await searchRestaurants(keyword, pageNumber, pageSize);
  },
);

export const fetchTopRatedRestaurants = createAsyncThunk(
  'restaurant/fetchTopRatedRestaurants',
  async (count = 10) => {
    return await getTopRatedRestaurants(count);
  },
);

export const fetchOpenNowRestaurants = createAsyncThunk(
  'restaurant/fetchOpenNowRestaurants',
  async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    return await getOpenNowRestaurants(pageNumber, pageSize);
  },
);

const initialState = {
  items: [],

  topRatedItems: [],
  openNowItems: [],

  pageNumber: 1,
  totalPages: 1,
  totalCount: 0,

  restaurant: null,

  status: 'idle',
  error: null,
};


const restaurantSlice = createSlice({
  name: 'restaurant',

  initialState,

  reducers: {
    clearRestaurantDetail(state) {
      state.restaurant = null;
    },
  },

  extraReducers: builder => {
    builder

    
    
    

      .addCase(fetchRestaurants.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = action.payload?.items ?? [];

        state.pageNumber = action.payload?.pageNumber ?? 1;

        state.totalPages = action.payload?.totalPages ?? 1;

        state.totalCount = action.payload?.totalCount ?? state.items.length;

        state.error = null;
      })

      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.error.message;
      })

    
    
    

      .addCase(fetchRestaurantById.pending, state => {
        state.status = 'loading';

        state.error = null;
      })

      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.restaurant = action.payload;

        state.error = null;
      })

      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.error.message;
      })

    
      .addCase(searchRestaurantsAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(searchRestaurantsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.items = action.payload?.items ?? [];

        state.pageNumber = action.payload?.pageNumber ?? 1;

        state.totalPages = action.payload?.totalPages ?? 1;

        state.totalCount = action.payload?.totalCount ?? state.items.length;

        state.error = null;
      })

      .addCase(searchRestaurantsAsync.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.error.message;
      })
    
    
    

      .addCase(fetchTopRatedRestaurants.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchTopRatedRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.topRatedItems = action.payload ?? [];

        state.error = null;
      })

      .addCase(fetchTopRatedRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
    
    
    

      .addCase(fetchOpenNowRestaurants.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchOpenNowRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.openNowItems = action.payload?.items ?? [];

        state.error = null;
      })

      .addCase(fetchOpenNowRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

  },
});

export const { clearRestaurantDetail } = restaurantSlice.actions;

export default restaurantSlice.reducer;
