import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async ({ pageNumber = 1, pageSize = 20, refresh = false } = {}) => {
    const data = await getNotifications(pageNumber, pageSize);

    return {
      data,
      refresh,
    };
  },
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async () => {
    return await getUnreadCount();
  },
);

export const markAsReadAsync = createAsyncThunk(
  'notification/markAsRead',
  async id => {
    await markNotificationAsRead(id);

    return id;
  },
);

export const markAllAsReadAsync = createAsyncThunk(
  'notification/markAllAsRead',
  async () => {
    await markAllNotificationsAsRead();
  },
);

const initialState = {
  items: [],

  pageNumber: 1,
  hasMore: true,

  unreadCount: 0,

  status: 'idle',
  loadMoreStatus: 'idle',
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',

  initialState,

  reducers: {
    clearNotifications(state) {
      state.items = [];
      state.pageNumber = 1;
      state.hasMore = true;
      state.status = 'idle';
    },
  },

  extraReducers: builder => {
    builder

      .addCase(fetchNotifications.pending, (state, action) => {
        const { refresh, pageNumber } = action.meta.arg ?? {};

        if (refresh || pageNumber === 1 || !pageNumber) {
          state.status = 'loading';
        } else {
          state.loadMoreStatus = 'loading';
        }

        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { data, refresh } = action.payload;
        const items = data?.items ?? [];

        state.items = refresh || data?.pageNumber === 1
          ? items
          : [...state.items, ...items];

        state.pageNumber = data?.pageNumber ?? 1;
        state.hasMore = data?.hasNextPage ?? false;

        state.status = 'succeeded';
        state.loadMoreStatus = 'succeeded';
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.loadMoreStatus = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload?.unreadCount ?? 0;
      })

      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.items.find(item => item.id === id);

        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      .addCase(markAllAsReadAsync.fulfilled, state => {
        state.items.forEach(item => {
          item.isRead = true;
        });

        state.unreadCount = 0;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;