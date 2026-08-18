import React from "react";
import { Pressable, View } from "react-native";
import { Searchbar, IconButton } from "react-native-paper";

import { COLORS } from "../styles/theme";
import homeStyles from "../styles/home";

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  onPress,
  editable = true,
}) {
  return (
    <View style={homeStyles.searchContainer}>
      <Pressable
        style={homeStyles.searchPressable}
        onPress={!editable ? onPress : undefined}
      >
        <Searchbar
          editable={editable}
          placeholder="Search for local food or restaurants"
          value={value}
          onChangeText={onChangeText}
          style={homeStyles.searchBar}
          inputStyle={homeStyles.searchInput}
          iconColor={COLORS.neutral}
          placeholderTextColor={COLORS.placeholder}
        />
      </Pressable>

      <IconButton
        icon="tune-variant"
        size={24}
        iconColor={COLORS.primary}
        style={homeStyles.filterButton}
        onPress={onFilterPress}
      />
    </View>
  );
}