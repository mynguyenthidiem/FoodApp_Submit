import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder,
} from "../services/orderService";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async ({ pageNumber = 1, pageSize = 20 } = {}) => {
    return await getOrders(pageNumber, pageSize);
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (id) => {
    return await getOrderById(id);
  }
);

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (data) => {
    return await createOrder(data);
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (data, { dispatch }) => {
    await updateOrder(data);

    return await getOrderById(data.id);
  }
);

export const cancelOrderAsync = createAsyncThunk(
  "order/cancelOrder",
  async (id, { dispatch }) => {
    await cancelOrder(id);

    return id;
  }
);

const initialState = {
  // Order list

  items: [],

  pageNumber: 1,

  totalPages: 1,

  totalCount: 0,

  // Current order

  currentOrder: null,

  // Loading

  status: "idle",

  error: null,
};

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder;

    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = action.payload.items;

        state.pageNumber = action.payload.pageNumber;

        state.totalPages = action.payload.totalPages;

        state.totalCount = action.payload.totalCount;

        state.error = null;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message;
      });

    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.currentOrder = action.payload;

        state.error = null;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message;
      });

    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.currentOrder = action.payload;

        state.items.unshift(action.payload);

        state.totalCount += 1;

        state.error = null;
      })

      .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message;
      });

    builder
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.currentOrder = action.payload;

        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        state.error = null;
      })

      .addCase(updateOrderAsync.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message;
      });

    builder
      .addCase(cancelOrderAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload
        ) {
          state.currentOrder.status = "Cancelled";
        }

        const order = state.items.find(
          (item) => item.id === action.payload
        );

        if (order) {
          order.status = "Cancelled";
        }

        state.error = null;
      })

      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.error.message;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;