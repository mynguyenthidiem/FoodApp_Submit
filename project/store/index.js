import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './cartSlice';
import userReducer from './userSlice';
import orderReducer from './orderSlice';
import categoryReducer from './categorySlice';
import favoriteReducer from './favoriteSlice';
import foodReducer from './foodSlice';
import restaurantReducer from './restaurantSlice';
import reviewReducer from './reviewSlice';
import authReducer from './authSlice';
import paymentReducer from './paymentSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    category: categoryReducer,
    favorite: favoriteReducer,
    food: foodReducer,
    restaurant: restaurantReducer,
    review: reviewReducer,
    payment: paymentReducer,
    notification: notificationReducer,
  },
});
