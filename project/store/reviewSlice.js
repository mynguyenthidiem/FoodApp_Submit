import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getReviewById,
  getFoodReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService';

// ======================================
// GET REVIEW BY ID
// GET /api/Review/{id}
// ======================================

export const fetchReviewById = createAsyncThunk(
  'review/fetchReviewById',
  async id => {
    return await getReviewById(id);
  },
);

// ======================================
// GET REVIEWS BY FOOD
// GET /api/Review/food/{foodId}
// ======================================

export const fetchFoodReviews = createAsyncThunk(
  'review/fetchFoodReviews',
  async ({ foodId, pageNumber = 1, pageSize = 20 }) => {
    const data = await getFoodReviews(foodId, pageNumber, pageSize);

    return {
      foodId,
      data,
    };
  },
);

// ======================================
// CREATE REVIEW
// POST /api/Review
// ======================================

export const createReviewAsync = createAsyncThunk(
  'review/createReview',
  async data => {
    return await createReview(data);
  },
);

// ======================================
// UPDATE REVIEW
// PUT /api/Review/{id}
// ======================================

export const updateReviewAsync = createAsyncThunk(
  'review/updateReview',
  async ({ id, data }) => {
    await updateReview(id, data);

    return {
      id,
      data,
    };
  },
);

// ======================================
// DELETE REVIEW
// DELETE /api/Review/{id}
// ======================================

export const deleteReviewAsync = createAsyncThunk(
  'review/deleteReview',
  async id => {
    await deleteReview(id);

    return id;
  },
);

const initialState = {
  // Review detail
  review: null,

  // Reviews grouped by food
  reviewsByFood: {},

  status: 'idle',
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',

  initialState,

  reducers: {
    clearReviewDetail(state) {
      state.review = null;
    },

    clearReviewsByFood(state) {
      state.reviewsByFood = {};
    },
  },

  extraReducers: builder => {
    builder

      // ======================================
      // GET REVIEW BY ID
      // ======================================

      .addCase(fetchReviewById.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.review = action.payload;
      })

      .addCase(fetchReviewById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ======================================
      // GET FOOD REVIEWS
      // ======================================

      .addCase(fetchFoodReviews.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchFoodReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const { foodId, data } = action.payload;

        state.reviewsByFood[foodId] = data.items ?? [];
      })

      .addCase(fetchFoodReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ======================================
      // CREATE
      // ======================================

      .addCase(createReviewAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const review = action.payload;

        if (review?.foodId) {
          if (!state.reviewsByFood[review.foodId]) {
            state.reviewsByFood[review.foodId] = [];
          }

          state.reviewsByFood[review.foodId].push(review);
        }
      })

      .addCase(createReviewAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ======================================
      // UPDATE
      // ======================================

      .addCase(updateReviewAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(updateReviewAsync.fulfilled, state => {
        state.status = 'succeeded';
      })

      .addCase(updateReviewAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // ======================================
      // DELETE
      // ======================================

      .addCase(deleteReviewAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const deletedId = action.payload;

        Object.keys(state.reviewsByFood).forEach(foodId => {
          state.reviewsByFood[foodId] = state.reviewsByFood[foodId].filter(
            review => review.id !== deletedId,
          );
        });
      })

      .addCase(deleteReviewAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearReviewDetail, clearReviewsByFood } = reviewSlice.actions;

export default reviewSlice.reducer;
