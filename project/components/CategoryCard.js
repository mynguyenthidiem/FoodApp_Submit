import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import homeStyles from "../styles/home";
import { COLORS } from "../styles/theme";

export default function CategoryCard({
  item,
  selected,
  onPress,
  variant = "icon",
}) {

  if (variant === "icon") {
    return (
      <TouchableOpacity
        style={homeStyles.categoryCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View
          style={[
            homeStyles.categoryIcon,
            selected && homeStyles.selectedCategoryIcon,
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={selected ? COLORS.brown : COLORS.primary}
          />
        </View>

        <Text
          style={[
            homeStyles.categoryText,
            selected && homeStyles.selectedCategoryText,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  if (variant === "large") {
    return (
      <TouchableOpacity
        style={homeStyles.categoryLargeCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image
          source={item.image}
          style={homeStyles.categoryLargeImage}
        />

        <View style={homeStyles.categoryOverlay}>
          <Text style={homeStyles.categoryTag}>
            {item.tag}
          </Text>

          <Text style={homeStyles.categoryLargeTitle}>
            {item.name}
          </Text>

          <Text style={homeStyles.categoryLargeSubtitle}>
            {item.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={homeStyles.categorySmallCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={homeStyles.categorySmallContent}>
        <Text style={homeStyles.categorySmallTitle}>
          {item.name}
        </Text>

        <Text style={homeStyles.categorySmallSubtitle}>
          {item.subtitle}
        </Text>
      </View>

      <Image
        source={item.image}
        style={homeStyles.categorySmallImage}
      />
    </TouchableOpacity>
  );
}
