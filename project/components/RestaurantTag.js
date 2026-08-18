import React from "react";
import { View, Text } from "react-native";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantTag({ title }) {
  return (
    <View style={restaurantStyles.tag}>
      <Text style={restaurantStyles.tagText}>
        {title}
      </Text>
    </View>
  );
}