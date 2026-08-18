import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { resolveImage } from "../utils/imageUrl";
import { COLORS } from "../styles/theme";

export default function MenuItemCard({
  item,
  onPress,
  onAddPress,
  cartMode = false,
  quantity = 1,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <TouchableOpacity
      disabled={cartMode}
      activeOpacity={cartMode ? 1 : 0.9}
      style={restaurantStyles.menuItemCard}
      onPress={onPress}
    >
      <Image
        source={resolveImage(item.image)}
        style={restaurantStyles.menuItemImage}
        resizeMode="cover"
      />

      <View style={restaurantStyles.menuItemContent}>
        <View style={restaurantStyles.menuItemTitleRow}>
          <Text numberOfLines={1} style={restaurantStyles.menuItemName}>
            {item.name}
          </Text>

          <Text style={restaurantStyles.menuItemPrice}>
            ${Number(item.price ?? 0).toFixed(2)}
          </Text>
        </View>

        {item.description ? (
          <Text numberOfLines={2} style={restaurantStyles.menuItemDescription}>
            {item.description}
          </Text>
        ) : null}
        {cartMode ? (
          <View style={restaurantStyles.cartControls}>
            <View style={restaurantStyles.quantityRow}>
              <TouchableOpacity
                style={restaurantStyles.qtyButton}
                onPress={onDecrease}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={18}
                  color={COLORS.heading}
                />
              </TouchableOpacity>

              <Text style={restaurantStyles.qtyText}>{quantity}</Text>

              <TouchableOpacity
                style={restaurantStyles.qtyButton}
                onPress={onIncrease}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={18}
                  color={COLORS.heading}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onRemove}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={restaurantStyles.addOrderButton}
            onPress={onAddPress}
          >
            <Text style={restaurantStyles.addOrderButtonText}>
              ＋ Add to Order
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
