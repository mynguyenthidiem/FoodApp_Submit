import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import homeStyles from "../styles/home";
import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";

export default function FoodCard({ item, onPress, onFavoritePress, onAddPress}) {
  return (
    <TouchableOpacity
      style={homeStyles.foodCard}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
    >
      <View style={homeStyles.foodImageContainer}>
        <Image
          source={resolveImage(item.image)}
          style={homeStyles.foodImage}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={homeStyles.favoriteButton}
          onPress={() => onFavoritePress?.(item)}
        >
          <MaterialCommunityIcons
            name={item.favorite ? "heart" : "heart-outline"}
            size={22}
            color={item.favorite ? COLORS.primary : COLORS.neutral}
          />
        </TouchableOpacity>
      </View>

      <Text numberOfLines={2} style={homeStyles.foodName}>
        {item.name}
      </Text>

      <View style={homeStyles.foodBottom}>
        <Text style={homeStyles.foodPrice}>
          ${Number(item.price ?? 0).toFixed(2)}
        </Text>

        <TouchableOpacity style={homeStyles.addButton} onPress={() => onAddPress?.(item)}>
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
