import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import favoriteStyles from "../styles/favorite";
import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";

export default function FavoriteRestaurantCard({
  item,
  onPress,
  onFavoritePress,
}) {
  return (
    <TouchableOpacity
      style={favoriteStyles.card}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
    >
      <View style={favoriteStyles.cardImageWrapper}>
        <Image
          source={resolveImage(item.imageUrl)}
          style={favoriteStyles.cardImage}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={favoriteStyles.heartButton}
          onPress={() => onFavoritePress?.(item)}
        >
          <MaterialCommunityIcons name="heart" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        {!item.isActive && (
          <View style={favoriteStyles.statusBadge}>
            <Text style={favoriteStyles.statusBadgeText}>Closed</Text>
          </View>
        )}
      </View>

      <View style={favoriteStyles.nameRow}>
        <Text numberOfLines={1} style={favoriteStyles.cardName}>
          {item.name}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
          <Text style={[favoriteStyles.cardPrice, { marginLeft: 2 }]}>
            {Number(item.rating ?? 0).toFixed(1)}
          </Text>
        </View>
      </View>

      <Text numberOfLines={2} style={favoriteStyles.cardDescription}>
        {item.address}
      </Text>

      <TouchableOpacity
        style={favoriteStyles.addToCartButton}
        activeOpacity={0.85}
        onPress={() => onPress?.(item)}
      >
        <MaterialCommunityIcons name="storefront-outline" size={16} color={COLORS.white} />
        <Text style={favoriteStyles.addToCartText}>View Menu</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}