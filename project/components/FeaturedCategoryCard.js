import React from "react";
import LinearGradient from "react-native-linear-gradient";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
} from "react-native";

import homeStyles from "../styles/home";
import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";
export default function FeaturedCategoryCard({
  item,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={homeStyles.featuredCategoryCard}
      activeOpacity={0.9}
      onPress={onPress}
    >

      <Image
        source={resolveImage(item.image)}
        style={homeStyles.featuredCategoryImage}
      />


      <LinearGradient
        colors={[
          "transparent",
          COLORS.overlayBlackLight,
          COLORS.overlayBlack,
        ]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={homeStyles.featuredCategoryOverlay}
      >
        <View style={homeStyles.featuredBadge}>
          <Text style={homeStyles.featuredBadgeText}>
            Category
          </Text>
        </View>

        <Text style={homeStyles.featuredCategoryTitle}>
          {item.title || item.name}
        </Text>

        {!!item.subtitle && (
          <Text
            style={
              homeStyles.featuredCategorySubtitle
            }
          >
            {item.subtitle}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}