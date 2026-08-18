import React from "react";
import { View } from "react-native";

import RestaurantSectionTitle from "./RestaurantSectionTitle";
import RestaurantFeatureChip from "./RestaurantFeatureChip";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantFeatureSection({
  features = [],
}) {
  return (
    <View style={restaurantStyles.featureSection}>

      <RestaurantSectionTitle
        title="Features"
      />

      <View style={restaurantStyles.featureContainer}>
        {features.map((feature) => (
          <RestaurantFeatureChip
            key={feature}
            title={feature}
          />
        ))}
      </View>

    </View>
  );
}