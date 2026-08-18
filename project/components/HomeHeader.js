import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar, IconButton } from "react-native-paper";

import homeStyles from "../styles/home";
import { COLORS } from "../styles/theme";

export default function HomeHeader({ appName, location, avatar, unreadCount, onNotificationPress, onProfilePress, }) {
  return (
    <View style={homeStyles.headerContainer}>
      <View style={homeStyles.headerContent}>
        <View style={homeStyles.headerTop}>
          <View style={homeStyles.leftContainer}>
            <Text style={homeStyles.appName}>
              {appName}
            </Text>
            <View style={homeStyles.locationContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color={COLORS.primary}
              />

              <Text style={homeStyles.locationText}>
                {location}
              </Text>
            </View>
          </View>
          <View style={homeStyles.rightContainer}>
            <IconButton
              icon="bell-outline"
              size={24}
              onPress={onNotificationPress}
            />

            {unreadCount > 0 && (
                <View style={homeStyles.notificationBadge}>
                  <Text style={homeStyles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            <TouchableOpacity onPress={onProfilePress}>
              <Avatar.Image
                size={42}
                source={avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
