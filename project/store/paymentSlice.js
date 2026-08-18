import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { createPayment, getPaymentByOrder } from '../services/paymentService';

export const createPaymentThunk = createAsyncThunk(
  'payment/createPayment',

  async ({ orderId, method }, { rejectWithValue }) => {
    try {
      const response = await createPayment({
        orderId: Number(orderId),
        method,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to create payment.',
      );
    }
  },
);

export const fetchPaymentByOrder = createAsyncThunk(
  'payment/fetchPaymentByOrder',

  async (orderId, { rejectWithValue }) => {
    try {
      const response = await getPaymentByOrder(Number(orderId));

      return response;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to get payment.',
      });
    }
  },
);

const initialState = {
  payment: null,

  status: 'idle',
  error: null,

  fetchStatus: 'idle',
  fetchError: null,

  hasPayment: false,
};

const paymentSlice = createSlice({
  name: 'payment',

  initialState,

  reducers: {




    clearPayment: state => {
      state.payment = null;

      state.status = 'idle';
      state.error = null;

      state.fetchStatus = 'idle';
      state.fetchError = null;

      state.hasPayment = false;
    },





    clearPaymentError: state => {
      state.error = null;
    },





    clearPaymentFetchError: state => {
      state.fetchError = null;
    },
  },

  extraReducers: builder => {




    builder
      .addCase(createPaymentThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(createPaymentThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        const payment = action.payload?.payment || action.payload || null;

        state.payment = payment;
        state.hasPayment = !!payment;
      })

      .addCase(createPaymentThunk.rejected, (state, action) => {
        state.status = 'failed';

        state.error = action.payload || 'Failed to create payment.';
      });





    builder
      .addCase(fetchPaymentByOrder.pending, state => {
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })

      .addCase(fetchPaymentByOrder.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.fetchError = null;

        const payment = action.payload?.payment || action.payload || null;

        state.payment = payment;
        state.hasPayment = !!payment;
      })

      .addCase(fetchPaymentByOrder.rejected, (state, action) => {
        const error = action.payload;

        /*
         * 404 = Payment chưa tồn tại.
         *
         * Đây KHÔNG phải lỗi thực sự đối với PaymentScreen.
         * Nó chỉ có nghĩa:
         *
         * Order đã tồn tại
         * nhưng chưa có Payment
         *
         * => Cho phép user chọn payment method và tạo payment.
         */

        if (error?.status === 404) {
          state.fetchStatus = 'notFound';
          state.fetchError = null;
          state.payment = null;
          state.hasPayment = false;

          return;
        }

    
        state.fetchStatus = 'failed';

        state.fetchError = error?.message || 'Failed to get payment.';

        state.payment = null;
        state.hasPayment = false;
      });
  },
});

export const { clearPayment, clearPaymentError, clearPaymentFetchError } =
  paymentSlice.actions;

export const selectPayment = state => state.payment.payment;

export const selectPaymentStatus = state => state.payment.status;

export const selectPaymentError = state => state.payment.error;

export const selectPaymentFetchStatus = state => state.payment.fetchStatus;

export const selectPaymentFetchError = state => state.payment.fetchError;

export const selectHasPayment = state => state.payment.hasPayment;

export default paymentSlice.reducer;
