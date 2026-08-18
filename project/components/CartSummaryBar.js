import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import restaurantStyles from "../styles/restaurant";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CartSummaryBar({
  quantity,
  total,
  onPress,
  bottom=0,
}) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[restaurantStyles.cartSummaryBar,
    {
      bottom: bottom + 16,
    },
  ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={restaurantStyles.cartQuantityBox}>
        <Text style={restaurantStyles.cartQuantityText}>
          {quantity}
        </Text>
      </View>

      <Text style={restaurantStyles.cartTitle}>
        View Cart
      </Text>

      <Text style={restaurantStyles.cartTotal}>
        ${(total ?? 0).toFixed(2)}
      </Text>

    </TouchableOpacity>
  );
}