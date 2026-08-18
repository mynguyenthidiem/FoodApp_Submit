import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import onboardingStyles from "../styles/onboarding";

export default function OnboardingCard({image, title, description }) {
  return (
    <View style={onboardingStyles.onboardCard}>
      <Image  source={image}
              style={onboardingStyles.onboardImage}
              resizeMode="cover" />
      <View style={onboardingStyles.imageLabel}>
        <Text style={onboardingStyles.smallTitle}> {title} </Text>
        <Text style={onboardingStyles.smallDescription}> {description} </Text>
      </View>
    </View>
  );
}
