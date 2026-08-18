import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import homeStyles from "../styles/home";

export default function SectionHeader({
  title,
  buttonText,
  onPress,
}) {
  return (
    <View style={homeStyles.sectionHeader}>
      <Text style={homeStyles.sectionTitle}>
        {title}
      </Text>

      <TouchableOpacity onPress={onPress}>
        <Text style={homeStyles.sectionButton}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}