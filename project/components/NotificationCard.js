import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import notificationStyles from "../styles/notification";
import { COLORS } from "../styles/theme";
import { timeAgo } from "../utils/formatTime";

const TYPE_META = {
  0: { icon: "clipboard-check-outline", color: COLORS.primary, bg: COLORS.secondary, actionLabel: "Track Order" }, 
  1: { icon: "truck-delivery-outline", color: COLORS.tertiary, bg: "#DAF3F8", actionLabel: "Track Order" }, 
  2: { icon: "check-circle-outline", color: COLORS.success, bg: "#E1F3E1", actionLabel: null }, 
  3: { icon: "star-outline", color: COLORS.warning, bg: "#FFF3D6", actionLabel: null }, 
  4: { icon: "information-outline", color: COLORS.neutral, bg: COLORS.surfaceContainerLow, actionLabel: null }, 
};

export default function NotificationCard({ notification, onPress, onActionPress }) {
  const meta = TYPE_META[notification.type] ?? TYPE_META[4];
  const unread = !notification.isRead;

  const isDelivered =
    notification.type === 1 &&
    /delivered/i.test(notification.message ?? "");

  const actionLabel = isDelivered ? "Rate Order" : meta.actionLabel;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        notificationStyles.card,
        unread && notificationStyles.cardUnread,
      ]}
      onPress={() => onPress?.(notification)}
    >
      <View
        style={[notificationStyles.iconWrap, { backgroundColor: meta.bg }]}
      >
        <MaterialCommunityIcons name={meta.icon} size={22} color={meta.color} />
      </View>

      <View style={notificationStyles.cardBody}>
        <View style={notificationStyles.cardTopRow}>
          <View style={notificationStyles.titleRow}>
            <Text style={notificationStyles.cardTitle} numberOfLines={1}>
              {notification.title}
            </Text>

            {unread && <View style={notificationStyles.unreadDot} />}
          </View>

          <Text style={notificationStyles.cardTime}>
            {timeAgo(notification.createdAt)}
          </Text>
        </View>

        <Text style={notificationStyles.cardMessage} numberOfLines={3}>
          {notification.message}
        </Text>

        {actionLabel && (
          <TouchableOpacity
            style={notificationStyles.actionButton}
            activeOpacity={0.8}
            onPress={() => onActionPress?.(notification, isDelivered)}
          >
            <Text style={notificationStyles.actionButtonText}>
              {actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}