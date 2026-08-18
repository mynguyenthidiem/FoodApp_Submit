import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import commonStyles from '../styles/common';
import orderStyles from '../styles/order';
import { COLORS } from '../styles/theme';
import { fetchOrders } from '../store/orderSlice';
import { resolveImage } from '../utils/imageUrl';
import OrderCard from '../components/OrderCard';

const ACTIVE_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Delivering'];
const PAST_STATUSES = ['Delivered', 'Cancelled'];

export default function MyOrdersScreen({ navigation }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('active');

  const { items, status } = useSelector(state => state.order);
  const { currentUser } = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchOrders({ pageNumber: 1, pageSize: 20 }));
    }, [dispatch]),
  );

  const orders = useMemo(() => {
    const list = items ?? [];
    return activeTab === 'active'
      ? list.filter(o => ACTIVE_STATUSES.includes(o.status))
      : list.filter(o => PAST_STATUSES.includes(o.status));
  }, [items, activeTab]);

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'left', 'right']}>
      <View style={orderStyles.ordersHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={resolveImage(currentUser?.avatar)}
            style={orderStyles.ordersAvatar}
          />
        </TouchableOpacity>
        <Text style={orderStyles.ordersHeaderTitle}>Orders</Text>
      </View>

      <View style={orderStyles.ordersTabContainer}>
        <TouchableOpacity
          style={[orderStyles.ordersTab, activeTab === 'active' && orderStyles.ordersTabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[orderStyles.ordersTabText, activeTab === 'active' && orderStyles.ordersTabTextActive]}>
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[orderStyles.ordersTab, activeTab === 'past' && orderStyles.ordersTabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[orderStyles.ordersTabText, activeTab === 'past' && orderStyles.ordersTabTextActive]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      {status === 'loading' && orders.length === 0 && (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
      )}

      {status !== 'loading' && orders.length === 0 && (
        <View style={orderStyles.ordersEmptyContainer}>
          <MaterialCommunityIcons name="receipt-text-outline" size={48} color={COLORS.neutral} />
          <Text style={orderStyles.ordersEmptyText}>
            {activeTab === 'active' ? 'No active orders' : 'No past orders yet'}
          </Text>
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={orderStyles.ordersListContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={order => navigation.navigate('OrderDetail', { orderId: order.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}