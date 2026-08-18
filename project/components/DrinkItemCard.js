import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { resolveImage } from "../utils/imageUrl";

export default function DrinkItemCard({
  item,
  onAddPress,
}) {
  return (
    <View style={restaurantStyles.drinkItemCard}>

      <Image
        source={resolveImage(item.image)}
        style={restaurantStyles.drinkImage}
        resizeMode="cover"
      />

      <View style={restaurantStyles.drinkInfo}>

        <Text style={restaurantStyles.drinkName}>
          {item.name}
        </Text>

        <Text
          numberOfLines={2}
          style={restaurantStyles.drinkSize}
        >
          {item.description}
        </Text>

      </View>

      <View style={restaurantStyles.drinkRight}>

        <Text style={restaurantStyles.drinkPrice}>
          ${Number(item.price ?? 0).toFixed(2)}
        </Text>

        <TouchableOpacity
          style={restaurantStyles.drinkAddButton}
          onPress={onAddPress}
        >

          <MaterialCommunityIcons
            name="plus"
            size={20}
            color="white"
          />

        </TouchableOpacity>

      </View>

    </View>
  );
}