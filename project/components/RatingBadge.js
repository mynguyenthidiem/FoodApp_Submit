import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { COLORS } from "../styles/theme";

export default function RatingBadge({ rating }) {
  return (
    <View style={restaurantStyles.ratingBadge}>
      <MaterialCommunityIcons
        name="star"
        size={14}
        color={COLORS.warning}
      />

      <Text style={restaurantStyles.ratingText}>
        {rating}
      </Text>
    </View>
  );
}
