import React from "react";
import { Text } from "react-native";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantSectionTitle({
  title,
}) {
  return (
    <Text
      style={restaurantStyles.sectionTitle}
    >
      {title}
    </Text>
  );
}