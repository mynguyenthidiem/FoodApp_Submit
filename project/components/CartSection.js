import React from "react";
import { View, Text } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import foodStyles from "../styles/food";
import { COLORS } from "../styles/theme";

import RestaurantSectionTitle from "./RestaurantSectionTitle";
import CartItemCard from "./CartItemCard";

export default function CartSection({
  restaurant,
  items,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  if (!items.length) return null;

  return (
    <View>
      {!!restaurant && (
        <View style={foodStyles.infoCard}>
          <View style={foodStyles.infoItem}>
            <MaterialCommunityIcons
              name="storefront-outline"
              size={22}
              color={COLORS.primary}
            />

            <Text style={foodStyles.infoValue}>{restaurant.name}</Text>
          </View>

          <View style={foodStyles.infoDivider} />

          <View style={foodStyles.infoItem}>
            <MaterialCommunityIcons name="star" size={20} color="#FFC107" />

            <Text style={foodStyles.infoValue}>
              {Number(restaurant.rating ?? 0).toFixed(1)}
            </Text>
          </View>

          <View style={foodStyles.infoDivider} />

          <View style={foodStyles.infoItem}>
            <MaterialCommunityIcons
              name="bike-fast"
              size={20}
              color={COLORS.primary}
            />

            <Text style={foodStyles.infoValue}>
              ${Number(restaurant.deliveryFee ?? 0).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      <RestaurantSectionTitle title="Items" />

      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
          onDelete={() => onRemove(item.id)}
        />
      ))}
    </View>
  );
}
