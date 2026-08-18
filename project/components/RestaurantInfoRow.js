import React from "react";
import {
  View,
  Text,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { COLORS } from "../styles/theme";

export default function RestaurantInfoRow({
  icon,
  title,
  value,
}) {
  return (
    <View style={restaurantStyles.infoSectionRow}>

      <View style={restaurantStyles.infoIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={COLORS.primary}
        />
      </View>

      <View style={restaurantStyles.infoContent}>
        <Text style={restaurantStyles.infoSectionTitle}>
          {title}
        </Text>

        <Text style={restaurantStyles.infoValue}>
          {value}
        </Text>
      </View>

    </View>
  );
}
