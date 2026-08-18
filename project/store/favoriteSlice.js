import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getFavoriteFoods,
  addFavoriteFood,
  removeFavoriteFood,
  getFavoriteRestaurants,
  addFavoriteRestaurant,
  removeFavoriteRestaurant,
} from '../services/favoriteService';

export const fetchFavoriteFoods = createAsyncThunk(
  'favorite/fetchFavoriteFoods',
  async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    return await getFavoriteFoods(pageNumber, pageSize);
  },
);

export const toggleFavorite = createAsyncThunk(
  'favorite/toggleFavorite',
  async (foodId, { getState }) => {
    const isFavorite = getState().favorite.items.includes(foodId);

    if (isFavorite) {
      await removeFavoriteFood(foodId);
    } else {
      await addFavoriteFood(foodId);
    }

    return foodId;
  },
);

export const fetchFavoriteRestaurants = createAsyncThunk(
  'favorite/fetchFavoriteRestaurants',
  async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    return await getFavoriteRestaurants(pageNumber, pageSize);
  },
);

export const toggleRestaurantFavorite = createAsyncThunk(
  'favorite/toggleRestaurantFavorite',
  async (restaurantId, { getState }) => {
    const isFavorite = getState().favorite.restaurantIds.includes(restaurantId);

    if (isFavorite) {
      await removeFavoriteRestaurant(restaurantId);
    } else {
      await addFavoriteRestaurant(restaurantId);
    }

    return restaurantId;
  },
);

const initialState = {
  items: [], 
  foods: [],
  foodsStatus: 'idle',

  restaurantIds: [],
  restaurants: [],
  restaurantsStatus: 'idle',

  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchFavoriteFoods.pending, state => {
        state.foodsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchFavoriteFoods.fulfilled, (state, action) => {
        state.foodsStatus = 'succeeded';
        state.foods = action.payload?.items ?? [];
        state.items = state.foods.map(f => f.id);
      })
      .addCase(fetchFavoriteFoods.rejected, (state, action) => {
        state.foodsStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const id = action.payload;

        if (state.items.includes(id)) {
          state.items = state.items.filter(i => i !== id);
          state.foods = state.foods.filter(f => f.id !== id);
        } else {
          state.items.push(id);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchFavoriteRestaurants.pending, state => {
        state.restaurantsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchFavoriteRestaurants.fulfilled, (state, action) => {
        state.restaurantsStatus = 'succeeded';
        state.restaurants = action.payload?.items ?? [];
        state.restaurantIds = state.restaurants.map(r => r.id);
      })
      .addCase(fetchFavoriteRestaurants.rejected, (state, action) => {
        state.restaurantsStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleRestaurantFavorite.fulfilled, (state, action) => {
        const id = action.payload;

        if (state.restaurantIds.includes(id)) {
          state.restaurantIds = state.restaurantIds.filter(i => i !== id);
          state.restaurants = state.restaurants.filter(r => r.id !== id);
        } else {
          state.restaurantIds.push(id);
        }
      })
      .addCase(toggleRestaurantFavorite.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default favoriteSlice.reducer;