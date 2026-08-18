import React from "react";
import { TouchableOpacity, Text } from "react-native";

import homeStyles from "../styles/home";

export default function FilterChip({
  title,
  selected,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[
        homeStyles.filterChip,
        selected && homeStyles.selectedFilterChip,
      ]}
      onPress={onPress}
      activeOpacity={0.5}
    >
      <Text
        style={[
          homeStyles.filterChipText,
          selected && homeStyles.selectedFilterChipText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}