import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import favoriteStyles from "../styles/favorite";
import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";

export default function FavoriteFoodCard({
  item,
  onPress,
  onFavoritePress,
  onAddPress,
}) {
  const isAvailable = item.status === 0 || item.status === "Available";

  return (
    <TouchableOpacity
      style={favoriteStyles.card}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
    >
      <View style={favoriteStyles.cardImageWrapper}>
        <Image
          source={resolveImage(item.image)}
          style={favoriteStyles.cardImage}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={favoriteStyles.heartButton}
          onPress={() => onFavoritePress?.(item)}
        >
          <MaterialCommunityIcons name="heart" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        {!isAvailable && (
          <View style={favoriteStyles.statusBadge}>
            <Text style={favoriteStyles.statusBadgeText}>Unavailable</Text>
          </View>
        )}
      </View>

      <View style={favoriteStyles.nameRow}>
        <Text numberOfLines={1} style={favoriteStyles.cardName}>
          {item.name}
        </Text>

        <Text style={favoriteStyles.cardPrice}>
          ${Number(item.price ?? 0).toFixed(2)}
        </Text>
      </View>

      {!!item.description && (
        <Text numberOfLines={2} style={favoriteStyles.cardDescription}>
          {item.description}
        </Text>
      )}

      <TouchableOpacity
        style={favoriteStyles.addToCartButton}
        activeOpacity={0.85}
        disabled={!isAvailable}
        onPress={() => onAddPress?.(item)}
      >
        <MaterialCommunityIcons name="cart-outline" size={16} color={COLORS.white} />
        <Text style={favoriteStyles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}