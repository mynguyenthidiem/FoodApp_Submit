import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getUserById, updateProfile } from '../services/userService';

// ======================================
// GET USER
// GET /api/User/{id}
// ======================================

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (id, { rejectWithValue }) => {
    try {
      return await getUserById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to load user',
      );
    }
  },
);

// ======================================
// UPDATE PROFILE
// PUT /api/User/profile/{id}
// ======================================

export const updateProfileAsync = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      await updateProfile(data);
      // Sau khi update profile, backend trả về dữ liệu user mới.
      // Vì vậy phải GET lại user để lấy dữ liệu mới.
      return await getUserById(data.id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to update profile',
      );
    }
  },
);

// ======================================
// INITIAL STATE
// ======================================

const initialState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

// ======================================
// SLICE
// ======================================

const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    clearCurrentUser: state => {
      state.currentUser = null;
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder

      // ======================================
      // FETCH USER
      // ======================================

      .addCase(fetchCurrentUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload || action.error.message || 'Failed to load user';
      })

      // ======================================
      // UPDATE PROFILE
      // ======================================

      .addCase(updateProfileAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.error = null;
      })

      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload || action.error.message || 'Failed to update profile';
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;

export default userSlice.reducer;
