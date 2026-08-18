import React from "react";
import {
  View,
  Text,
  Image,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";

import RatingBadge from "./RatingBadge";
import RestaurantActionBar from "./RestaurantActionBar";
import { resolveImage } from "../utils/imageUrl";
export default function RestaurantHeroCard({
  restaurant,
  favorite,
  onBackPress,
  onFavoritePress,
}) {
  const formatTime = (time) => time?.slice(0, 5);
  return (
    <View style={restaurantStyles.heroCard}>
      <Image
        source={resolveImage(restaurant.imageUrl)}
        style={restaurantStyles.heroImage}
      />
      <RestaurantActionBar
        favorite={favorite}
        onBackPress={onBackPress}
        onSharePress={() => { }}
        onFavoritePress={onFavoritePress}
      />

      <View style={restaurantStyles.heroContent}>

        <View style={restaurantStyles.titleRow}>
          <Text
            style={restaurantStyles.heroTitle}
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>

          <RatingBadge rating={restaurant.rating} />
        </View>

        <Text style={restaurantStyles.heroCuisine}>
          {restaurant.categories?.slice(0, 3).join(" • ")}
        </Text>

        <View style={restaurantStyles.heroInfoRow}>

          <View style={restaurantStyles.heroInfo}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
            />
            <Text style={restaurantStyles.heroInfoText}>
              {formatTime(restaurant.openTime)} - {formatTime(restaurant.closeTime)}
            </Text>
          </View>

          <View style={restaurantStyles.heroInfo}>
            <MaterialCommunityIcons
              name="bike-fast"
              size={16}
            />
            <Text style={restaurantStyles.heroInfoText}>
              ${restaurant.deliveryFee ?? 0}
            </Text>
          </View>

          <View style={restaurantStyles.heroInfo}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
            />
            <Text
              style={restaurantStyles.heroInfoText}
              numberOfLines={1}
            >
              {restaurant.address ?? "No address"}
            </Text>
          </View>

        </View>

      </View>

    </View>
  );
}
