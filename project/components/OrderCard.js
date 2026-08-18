import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import orderStyles from '../styles/order';
import { COLORS } from '../styles/theme';

const STATUS_COLOR = {
  Pending: COLORS.warning ?? '#F39C12',
  Confirmed: COLORS.info ?? '#2E86DE',
  Preparing: COLORS.info ?? '#2E86DE',
  Delivering: COLORS.warning ?? '#F39C12',
  Delivered: COLORS.success ?? '#27AE60',
  Cancelled: COLORS.error ?? '#E74C3C',
};

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderCard({ order, onPress }) {
  const statusColor = STATUS_COLOR[order.status] || COLORS.primary;
  const itemCount = order.orderDetails?.reduce((sum, d) => sum + d.quantity, 0) ?? 0;

  return (
    <TouchableOpacity
      style={orderStyles.orderListCard}
      activeOpacity={0.9}
      onPress={() => onPress?.(order)}
    >
      <View style={orderStyles.orderListTop}>
        <View style={orderStyles.orderListIconWrapper}>
          <MaterialCommunityIcons name="storefront-outline" size={24} color={COLORS.primary} />
        </View>

        <View style={orderStyles.orderListInfo}>
          <Text style={orderStyles.orderListRestaurant}>{order.restaurantName}</Text>
          <Text style={orderStyles.orderListMeta}>
            {itemCount} Items • £{Number(order.totalAmount ?? 0).toFixed(2)}
          </Text>
        </View>

        <View style={[orderStyles.orderStatusBadge, { backgroundColor: statusColor }]}>
          <Text style={orderStyles.orderStatusText}>{order.status}</Text>
        </View>
      </View>

      <View style={orderStyles.orderListDivider} />

      <View style={orderStyles.orderListBottom}>
        <View style={orderStyles.orderEstimatedContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.primary} />
          <Text style={orderStyles.orderEstimatedText}>
            Ordered: {formatDate(order.orderDate)}
          </Text>
        </View>

        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <View style={orderStyles.orderTrackButton}>
            <Text style={orderStyles.orderTrackText}>Details</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}