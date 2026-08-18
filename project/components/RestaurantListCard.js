import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { COLORS } from "../styles/theme";

import RatingBadge from "./RatingBadge";
import RestaurantTag from "./RestaurantTag";
import FavoriteButton from "./FavoriteButton";

import { resolveImage } from "../utils/imageUrl";

export default function RestaurantListCard({
  item,
  favorite,
  onPress,
  onFavoritePress,
}) {
  return (
    <TouchableOpacity
      style={restaurantStyles.restaurantCard}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={restaurantStyles.imageContainer}>
        <Image
          source={resolveImage(item.imageUrl)}
          style={
            restaurantStyles.restaurantImage
          }
        />

        <FavoriteButton
          favorite={favorite}
          onPress={onFavoritePress}
        />
      </View>

      <View style={restaurantStyles.content}>
        <View style={restaurantStyles.titleRow}>
          <Text
            numberOfLines={1}
            style={
              restaurantStyles.restaurantName
            }
          >
            {item.name}
          </Text>

          <RatingBadge rating={item.rating} />
        </View>

        <View style={restaurantStyles.infoRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={15}
            color={COLORS.brown}
          />

          <Text
            style={
              restaurantStyles.infoText
            }
          >
            {item.openTime?.substring(0, 5)}
            {" - "}
            {item.closeTime?.substring(0, 5)}
          </Text>
        </View>

        <View
          style={[
            restaurantStyles.infoRow,
            { marginTop: 4 },
          ]}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={15}
            color={COLORS.brown}
          />

          <Text
            numberOfLines={1}
            style={
              restaurantStyles.infoText
            }
          >
            {item.address}
          </Text>
        </View>

        <View style={restaurantStyles.tagRow}>
          {(item.categories || []).map(
            (category) => (
              <RestaurantTag
                key={category}
                title={category}
              />
            )
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}