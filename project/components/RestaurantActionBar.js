import React from "react";
import { View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import restaurantStyles from "../styles/restaurant";
import { COLORS } from "../styles/theme";

export default function RestaurantActionBar({
  favorite,
  onBackPress,
  onSharePress,
  onFavoritePress,
}) {
  return (
    <SafeAreaView style={restaurantStyles.actionBar}>
      <TouchableOpacity
        style={restaurantStyles.actionButton}
        onPress={onBackPress}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={COLORS.brown}
        />
      </TouchableOpacity>

      <View style={restaurantStyles.actionRight}>
        <TouchableOpacity
          style={restaurantStyles.actionButton}
          onPress={onSharePress}
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={22}
            color={COLORS.brown}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={restaurantStyles.actionButton}
          onPress={onFavoritePress}
        >
          <MaterialCommunityIcons
            name={
              favorite
                ? "heart"
                : "heart-outline"
            }
            size={22}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}