import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import orderStyles from "../styles/order";
import foodStyles from "../styles/food";
import { COLORS } from "../styles/theme";

import { resolveImage } from "../utils/imageUrl";

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onDelete,
}) {
  return (
    <View style={orderStyles.cartItem}>

      <Image
        source={resolveImage(item.image)}
        style={orderStyles.cartImage}
        resizeMode="cover"
      />

      <View style={orderStyles.cartContent}>

        <Text
          numberOfLines={2}
          style={orderStyles.cartTitle}
        >
          {item.foodName}
        </Text>

        <View style={orderStyles.cartBottomRow}>

          <Text style={orderStyles.cartPrice}>
            ${Number(item.price).toFixed(2)}
          </Text>

          <View style={foodStyles.quantityCard}>

            <TouchableOpacity
              style={foodStyles.qtyButton}
              onPress={onDecrease}
            >
              <MaterialCommunityIcons
                name="minus"
                size={18}
                color={COLORS.heading}
              />
            </TouchableOpacity>

            <Text style={foodStyles.qtyNumber}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={foodStyles.qtyButton}
              onPress={onIncrease}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={COLORS.heading}
              />
            </TouchableOpacity>

          </View>

        </View>

      </View>

      <TouchableOpacity
        onPress={onDelete}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={22}
          color={COLORS.error}
        />
      </TouchableOpacity>

    </View>
  );
}