import React from "react";
import { View, Text } from "react-native";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantBadge({ text = "" }) {
  return (
    <View style={restaurantStyles.badge}>
      <Text style={restaurantStyles.badgeText}>
        {text.toUpperCase()}
      </Text>
    </View>
  );
}