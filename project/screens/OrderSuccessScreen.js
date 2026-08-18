import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomButton from '../components/CustomButton';

import commonStyles from '../styles/common';
import orderStyles from '../styles/order';
import { COLORS, SPACING } from '../styles/theme';

import { fetchOrderById } from '../store/orderSlice';

const PAYMENT_METHOD_LABELS = {
  0: 'Cash on Delivery (COD)',
  1: 'VNPay',
  2: 'MoMo',
};

const ORDER_STATUS_LABELS = {
  0: 'Pending',
  1: 'Confirmed',
  2: 'Preparing',
  3: 'Delivering',
  4: 'Completed',
  5: 'Cancelled',
};

export default function OrderSuccessScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { orderId } = route.params ?? {};

  const { currentOrder, status } = useSelector(state => state.order);

  useEffect(() => {
    if (orderId && currentOrder?.id !== orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId, currentOrder?.id]);

  const goToOrders = () => navigation.navigate('MainTabs', { screen: 'Orders' });
  const goToHome = () => navigation.navigate('MainTabs', { screen: 'Home' });

  if (!currentOrder && status === 'loading') {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={orderStyles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentOrder) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={orderStyles.emptyContainer}>
          <Text style={orderStyles.emptyTitle}>Order not found</Text>
          <Text style={orderStyles.emptyText}>
            We couldn't find the details for this order.
          </Text>
          <CustomButton title="Go to My Orders" onPress={goToOrders} />
        </View>
      </SafeAreaView>
    );
  }

  const statusLabel = ORDER_STATUS_LABELS[currentOrder.status] ?? 'Confirmed';
  const paymentLabel = PAYMENT_METHOD_LABELS[currentOrder.paymentMethod] ?? 'Cash on Delivery (COD)';

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[commonStyles.scrollContainer, { alignItems: 'center' }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginTop: SPACING.xl }}>
          <View style={orderStyles.paymentSuccessIcon}>
            <MaterialCommunityIcons name="check-bold" size={40} color={COLORS.white} />
          </View>

          <View style={orderStyles.confirmedBadge}>
            <MaterialCommunityIcons name="check-circle" size={14} color={COLORS.white} />
            <Text style={orderStyles.confirmedBadgeText}>{statusLabel}</Text>
          </View>

          <Text style={orderStyles.emptyTitle}>Order Confirmed!</Text>

          <Text style={orderStyles.emptyText}>
            Your delicious meal from{' '}
            <Text style={{ color: COLORS.primaryDark, fontWeight: '700' }}>
              {currentOrder.restaurantName}
            </Text>{' '}
            is being prepared with care.
          </Text>
        </View>

        <View style={[orderStyles.checkoutCard, { width: '100%', marginTop: SPACING.xl }]}>
          <View style={orderStyles.addressRow}>
            <View style={orderStyles.addressIcon}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primaryDark} />
            </View>

            <View style={orderStyles.addressContent}>
              <Text style={orderStyles.paymentBottomLabel}>ESTIMATED ARRIVAL</Text>
              <Text style={orderStyles.addressName}>25 - 30 mins</Text>
            </View>
          </View>

          <View style={orderStyles.paymentSummaryDivider} />

          <View style={orderStyles.addressRow}>
            <View style={orderStyles.addressIcon}>
              <MaterialCommunityIcons name="identifier" size={20} color={COLORS.primaryDark} />
            </View>

            <View style={orderStyles.addressContent}>
              <Text style={orderStyles.paymentBottomLabel}>ORDER ID</Text>
              <Text style={orderStyles.addressName}>#{currentOrder.id}</Text>
            </View>
          </View>
        </View>

        <View style={{ width: '100%', marginTop: SPACING.xl }}>
          <CustomButton title="View Order" onPress={goToOrders} />

          <TouchableOpacity style={orderStyles.secondaryButton} onPress={goToHome} activeOpacity={0.85}>
            <Text style={orderStyles.secondaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>

        <Text style={[orderStyles.paymentInfoText, { textAlign: 'center', marginTop: SPACING.md }]}>
          We'll send you a notification when your rider is nearby.
        </Text>

        <View style={[orderStyles.checkoutSection, { width: '100%', marginTop: SPACING.xl }]}>
          <Text style={orderStyles.checkoutSectionTitle}>Delivery Address</Text>

          <View style={orderStyles.checkoutCard}>
            <Text style={orderStyles.addressText}>{currentOrder.shippingAddress}</Text>
          </View>
        </View>

        <View style={[orderStyles.checkoutSection, { width: '100%' }]}>
          <Text style={orderStyles.checkoutSectionTitle}>Payment Method</Text>

          <View style={orderStyles.checkoutCard}>
            <View style={[orderStyles.paymentOption, orderStyles.paymentOptionLast]}>
              <View style={orderStyles.paymentIcon}>
                <MaterialCommunityIcons name="cash" size={20} color={COLORS.primaryDark} />
              </View>

              <View style={orderStyles.paymentContent}>
                <Text style={orderStyles.paymentTitle}>{paymentLabel}</Text>
                <Text style={orderStyles.paymentSubtitle}>
                  Total: ${Number(currentOrder.totalAmount).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}