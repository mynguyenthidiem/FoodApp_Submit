import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch, useSelector } from 'react-redux';

import BackHeader from '../components/BackHeader';

import commonStyles from '../styles/common';
import orderStyles from '../styles/order';
import { COLORS } from '../styles/theme';

import {
  createPaymentThunk,
  fetchPaymentByOrder,
  clearPayment,
  selectPayment,
  selectPaymentStatus,
  selectPaymentError,
  selectPaymentFetchStatus,
} from '../store/paymentSlice';

const PAYMENT_METHODS = [
  {
    id: 'COD',
    title: 'Cash on Delivery',
    subtitle: 'Pay when your order arrives',
    icon: 'cash',
  },
  {
    id: 'Card',
    title: 'Credit / Debit Card',
    subtitle: 'Pay securely by card',
    icon: 'credit-card-outline',
  },
  {
    id: 'Online',
    title: 'Online Payment',
    subtitle: 'Pay online instantly',
    icon: 'cellphone-check',
  },
];

const formatCurrency = value => {
  const amount = Number(value || 0);

  return `${amount.toLocaleString('vi-VN')} ₫`;
};

export default function PaymentScreen({ navigation, route }) {
  const dispatch = useDispatch();



  const {
    orderId,
    totalAmount = 0,
    subtotal = totalAmount,
    deliveryFee = 0,
  } = route.params || {};



  const payment = useSelector(selectPayment);
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentError = useSelector(selectPaymentError);
  const fetchStatus = useSelector(selectPaymentFetchStatus);



  const [selectedMethod, setSelectedMethod] = useState('COD');



  useEffect(() => {
    if (!orderId) {
      return;
    }

    dispatch(fetchPaymentByOrder(orderId));

    return () => {
      dispatch(clearPayment());
    };
  }, [dispatch, orderId]);



  useEffect(() => {
    if (!payment) {
      return;
    }

    if (payment.method) {
      setSelectedMethod(payment.method);
    }
  }, [payment]);



  const handlePayment = async () => {
    if (!orderId) {
      Alert.alert('Error', 'Order information is missing.');
      return;
    }

    if (paymentStatus === 'loading') {
      return;
    }

    try {
      const result = await dispatch(
        createPaymentThunk({
          orderId: Number(orderId),
          method: selectedMethod,
        }),
      ).unwrap();

      const createdPayment = result?.payment || result;

      navigation.replace('OrderSuccess', {
        orderId: Number(orderId),
        totalAmount,
        subtotal,
        deliveryFee,
        paymentMethod: createdPayment?.method || selectedMethod,
        paymentStatus: createdPayment?.status || 'Pending',
      });
    } catch (error) {
      Alert.alert(
        'Payment failed',
        typeof error === 'string'
          ? error
          : error?.message || 'Unable to create payment.',
      );
    }
  };



  if (!orderId) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <BackHeader title="Payment" onBack={() => navigation.goBack()} />

        <View style={orderStyles.emptyCheckout}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color={COLORS.error}
          />

          <Text style={orderStyles.emptyTitle}>Order not found</Text>

          <Text style={orderStyles.emptyText}>
            We could not find the order information required for payment.
          </Text>
        </View>
      </SafeAreaView>
    );
  }



  if (fetchStatus === 'loading') {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <BackHeader title="Payment" onBack={() => navigation.goBack()} />

        <View style={orderStyles.emptyCheckout}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={[orderStyles.emptyText, { marginTop: 16 }]}>
            Checking payment information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }



  if (fetchStatus === 'succeeded' && payment) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <BackHeader title="Payment" onBack={() => navigation.goBack()} />

        <ScrollView
          contentContainerStyle={[
            commonStyles.scrollContainer,
            {
              paddingBottom: 140,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={orderStyles.paymentHeaderContainer}>
            <Text style={commonStyles.title}>Payment Already Created</Text>

            <Text style={commonStyles.subtitle}>
              This order already has a payment.
            </Text>
          </View>



          <View style={orderStyles.paymentSummaryCard}>
            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Order</Text>

              <Text style={orderStyles.paymentSummaryValue}>#{orderId}</Text>
            </View>

            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Method</Text>

              <Text style={orderStyles.paymentSummaryValue}>
                {payment.method || selectedMethod}
              </Text>
            </View>

            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Status</Text>

              <Text
                style={[
                  orderStyles.paymentSummaryValue,
                  {
                    color:
                      payment.status === 'Completed' || payment.status === 2
                        ? COLORS.success
                        : COLORS.warning,
                  },
                ]}
              >
                {typeof payment.status === 'number'
                  ? payment.status === 2
                    ? 'Completed'
                    : payment.status === 1
                    ? 'Pending'
                    : 'Failed'
                  : payment.status}
              </Text>
            </View>

            <View style={orderStyles.paymentSummaryDivider} />

            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Amount</Text>

              <Text style={orderStyles.paymentSummaryTotal}>
                {formatCurrency(payment.amount ?? totalAmount)}
              </Text>
            </View>
          </View>



          {(payment.status === 'Pending' || payment.status === 1) && (
            <View style={orderStyles.paymentInfo}>
              <MaterialCommunityIcons
                name="information-outline"
                size={24}
                color={COLORS.primaryDark}
                style={orderStyles.paymentInfoIcon}
              />

              <View style={orderStyles.paymentInfoContent}>
                <Text style={orderStyles.paymentInfoTitle}>
                  Cash on Delivery
                </Text>

                <Text style={orderStyles.paymentInfoText}>
                  Please pay the restaurant when your order is delivered. The
                  restaurant owner will complete the payment after receiving the
                  cash.
                </Text>
              </View>
            </View>
          )}



          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                marginTop: 20,
              },
            ]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.replace('OrderSuccess', {
                orderId: Number(orderId),
                totalAmount: Number(payment.amount ?? totalAmount ?? 0),
                subtotal: Number(subtotal || 0),
                deliveryFee: Number(deliveryFee || 0),
                paymentMethod: payment.method || selectedMethod,
                payment,
              })
            }
          >
            <Text style={commonStyles.buttonText}>View Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={commonStyles.screen}>
      <BackHeader title="Payment" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[
          commonStyles.scrollContainer,
          {
            paddingBottom: 160,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >

        <View style={orderStyles.paymentHeaderContainer}>
          <Text style={commonStyles.title}>Choose Payment Method</Text>

          <Text style={commonStyles.subtitle}>
            Select how you would like to pay for your order.
          </Text>
        </View>


        <View style={orderStyles.checkoutSection}>
          <Text style={orderStyles.checkoutSectionTitle}>Payment Method</Text>

          <View style={orderStyles.checkoutCard}>
            {PAYMENT_METHODS.map((method, index) => {
              const selected = selectedMethod === method.id;

              const isLast = index === PAYMENT_METHODS.length - 1;

              return (
                <TouchableOpacity
                  key={method.id}
                  activeOpacity={0.8}
                  disabled={paymentStatus === 'loading'}
                  onPress={() => setSelectedMethod(method.id)}
                  style={[
                    orderStyles.paymentOption,

                    !isLast &&
                      !selected && {
                        borderBottomWidth: 1,
                      },

                    isLast && orderStyles.paymentOptionLast,

                    selected && orderStyles.paymentOptionSelected,
                  ]}
                >
        

                  <View style={orderStyles.paymentIcon}>
                    <MaterialCommunityIcons
                      name={method.icon}
                      size={23}
                      color={COLORS.primary}
                    />
                  </View>

        

                  <View style={orderStyles.paymentContent}>
                    <Text style={orderStyles.paymentTitle}>{method.title}</Text>

                    <Text style={orderStyles.paymentSubtitle}>
                      {method.subtitle}
                    </Text>
                  </View>

        

                  <View
                    style={[
                      orderStyles.radioOuter,
                      selected && orderStyles.radioOuterSelected,
                    ]}
                  >
                    {selected && <View style={orderStyles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>


        <View style={orderStyles.checkoutSection}>
          <Text style={orderStyles.checkoutSectionTitle}>Order Summary</Text>

          <View style={orderStyles.paymentSummaryCard}>
            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Order ID</Text>

              <Text style={orderStyles.paymentSummaryValue}>#{orderId}</Text>
            </View>

            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Subtotal</Text>

              <Text style={orderStyles.paymentSummaryValue}>
                {formatCurrency(subtotal)}
              </Text>
            </View>

            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.paymentSummaryLabel}>Delivery fee</Text>

              <Text style={orderStyles.paymentSummaryValue}>
                {formatCurrency(deliveryFee)}
              </Text>
            </View>

            <View style={orderStyles.paymentSummaryDivider} />

            <View style={orderStyles.paymentSummaryRow}>
              <Text style={orderStyles.checkoutTotalLabel}>Total</Text>

              <Text style={orderStyles.paymentSummaryTotal}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
          </View>
        </View>


        <View style={orderStyles.paymentInfo}>
          <MaterialCommunityIcons
            name={selectedMethod === 'COD' ? 'cash' : 'shield-check-outline'}
            size={24}
            color={COLORS.primaryDark}
            style={orderStyles.paymentInfoIcon}
          />

          <View style={orderStyles.paymentInfoContent}>
            <Text style={orderStyles.paymentInfoTitle}>
              {selectedMethod === 'COD'
                ? 'Cash on Delivery'
                : 'Demo Online Payment'}
            </Text>

            <Text style={orderStyles.paymentInfoText}>
              {selectedMethod === 'COD'
                ? 'You will pay the restaurant when your order is delivered. Your payment will remain pending until the restaurant owner completes it.'
                : 'This project currently uses a demo online payment flow. The payment will be marked as completed automatically.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={orderStyles.paymentBottomContainer}>
        <View style={orderStyles.paymentBottomRow}>
          <Text style={orderStyles.paymentBottomLabel}>Total to pay</Text>

          <Text style={orderStyles.paymentBottomValue}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            paymentStatus === 'loading' && orderStyles.paymentLoadingButton,
          ]}
          activeOpacity={0.8}
          disabled={paymentStatus === 'loading'}
          onPress={handlePayment}
        >
          {paymentStatus === 'loading' ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={commonStyles.buttonText}>
              {selectedMethod === 'COD' ? 'Place Order' : 'Pay Now'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
