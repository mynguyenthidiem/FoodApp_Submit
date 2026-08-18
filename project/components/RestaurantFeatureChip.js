import React from "react";
import { View, Text } from "react-native";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantFeatureChip({ title }) {
  return (
    <View style={restaurantStyles.featureChip}>
      <Text style={restaurantStyles.featureChipText}>
        {title}
      </Text>
    </View>
  );
}