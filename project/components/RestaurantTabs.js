import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
} from "react-native";

import restaurantStyles from "../styles/restaurant";

export default function RestaurantTabs({
  tabs,
  selectedTab,
  onChange,
}) {
  return (
    <View style={restaurantStyles.tabsContainer}>
      {tabs.map((tab) => {
        const selected = selectedTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            style={restaurantStyles.tabButton}
            onPress={() => onChange(tab)}
          >
            <Text
              style={[
                restaurantStyles.tabText,
                selected &&
                  restaurantStyles.selectedTabText,
              ]}
            >
              {tab}
            </Text>

            {selected && (
              <View
                style={restaurantStyles.tabIndicator}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}