import React from "react";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { COLORS } from "../styles/theme";

export default function FavoriteButton({
  favorite,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={restaurantStyles.favoriteButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name={favorite ? "heart" : "heart-outline"}
        size={22}
        color={favorite ? COLORS.primary : COLORS.brown}
      />
    </TouchableOpacity>
  );
}
