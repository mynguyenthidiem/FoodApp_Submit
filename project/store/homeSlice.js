

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFoods } from "../services/foodService";
import { getSystemCategories } from "../services/categoryService";
import { getAllRestaurants } from "../services/restaurantService";

export const fetchFoods = createAsyncThunk(
    "home/fetchFoods",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getFoods();
            return res.items ?? [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "home/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getSystemCategories();
            return res ?? [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchRestaurants = createAsyncThunk(
    "home/fetchRestaurants",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllRestaurants();
            return res.items ?? res ?? [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const homeSlice = createSlice({
    name: "home",
    initialState: {
        foods: [],
        categories: [],
        restaurants: [],

        foodsLoading: false,
        categoriesLoading: false,
        restaurantsLoading: false,

        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder

        
            .addCase(fetchFoods.pending, (state) => {
                state.foodsLoading = true;
            })
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.foods = action.payload;
                state.foodsLoading = false;
            })
            .addCase(fetchFoods.rejected, (state, action) => {
                state.foodsLoading = false;
                state.error = action.payload;
            })

        
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.categoriesLoading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.error = action.payload;
            })

        
            .addCase(fetchRestaurants.pending, (state) => {
                state.restaurantsLoading = true;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.restaurants = action.payload;
                state.restaurantsLoading = false;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.restaurantsLoading = false;
                state.error = action.payload;
            });
    },
});

export default homeSlice.reducer;