import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import CartScreen from "../screens/CartScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { COLORS } from "../styles/theme";
import commonStyles from "../styles/common";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
          let iconOutline;
          let iconFilled;

        switch (route.name) {
          case "Home":
            iconOutline = "home-outline";
            iconFilled = "home";
            break;

          case "Search":
            iconOutline = "magnify";
            iconFilled = "magnify-plus";
            break;

          case "Cart":
            iconOutline = "cart-outline";
            iconFilled = "cart";
            break;

          case "Orders":
            iconOutline = "clipboard-text-outline";
            iconFilled = "clipboard-text";
            break;

          case "Profile":
            iconOutline = "account-outline";
            iconFilled = "account";
            break;
        }

        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,

          tabBarStyle: commonStyles.bottomTabBar,

          tabBarActiveTintColor: COLORS.brown,
          tabBarInactiveTintColor: COLORS.neutral,

          tabBarIcon: ({ focused }) => {
            const iconName = focused ? iconFilled : iconOutline;
            if (focused) {
              return (
                <View style={commonStyles.activeIcon}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={22}
                    color={COLORS.brown}
                  />
                </View>
              );
            }

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={COLORS.neutral}
              />
            );
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={MyOrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
