import React from "react";
import { View } from "react-native";

import RestaurantSectionTitle from "./RestaurantSectionTitle";
import RestaurantInfoRow from "./RestaurantInfoRow";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantInfoSection({
  restaurant,
}) {

  return (
    <View style={restaurantStyles.infoSection}>

      <RestaurantSectionTitle
        title="Restaurant Information"
      />

      <View style={restaurantStyles.infoSectionCard}>

        <RestaurantInfoRow
          icon="map-marker-outline"
          title="Address"
          value={restaurant.address}
        />

        <RestaurantInfoRow
          icon="phone-outline"
          title="Phone"
          value={restaurant.phoneNumber}
        />

        <RestaurantInfoRow
          icon="email"
          title="Email"
          value={restaurant.email}
        />

        <RestaurantInfoRow
          icon="clock-outline"
          title="Opening Hours"
          value={`${restaurant.openTime} - ${restaurant.closeTime}`}
        />

        <RestaurantInfoRow
          icon="truck-delivery-outline"
          title="Delivery Fee"
          value={`$${restaurant.deliveryFee}`}
        />

        <RestaurantInfoRow
          icon="star-outline"
          title="Rating"
          value={`${restaurant.rating} (${restaurant.totalReviews} reviews)`}
        />

        <RestaurantInfoRow
          icon="food-outline"
          title="Food Items"
          value={`${restaurant.foodCount ?? 0} items`}
        />

        <RestaurantInfoRow
          icon="shape-outline"
          title="Categories"
          value={
            restaurant.categories?.join(", ") ?? "No categories"
          }
        />
      </View>
    </View>
  );
}