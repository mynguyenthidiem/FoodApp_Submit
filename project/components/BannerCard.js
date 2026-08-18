import React from "react";
import { View, Text, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Chip } from "react-native-paper";

import homeStyles from "../styles/home";
import {COLORS} from "../styles/theme";

export default function BannerCard({ title, subtitle, image, }) {
  return (
    <ImageBackground
      source={image}
      style={homeStyles.bannerCard}
      imageStyle={homeStyles.bannerImage}
    >
      <LinearGradient
        colors={[
          COLORS.overlayBlackDark,
          COLORS.overlayBlack,
          COLORS.overlayBlackLight,
          "transparent",
        ]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={homeStyles.bannerOverlay}
      >

        <Chip
          compact
          style={homeStyles.bannerChip}
          textStyle={homeStyles.bannerChipText}
        >
          FLASH SALE
        </Chip>

        <Text style={homeStyles.bannerTitle}>
          {title}
        </Text>

        <Text style={homeStyles.bannerSubtitle}>
          {subtitle}
        </Text>

      </LinearGradient>
    </ImageBackground>
  );
}
