import React, {useEffect} from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import commonStyles from "../styles/common";
import onboardingStyles from "../styles/onboarding";
import { COLORS } from "../styles/theme";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function SplashScreen({navigation}) {
  useEffect(() => {
    const timer = setTimeout( ()=>{
      navigation.replace("Login");
    }, 1500);
    return ()=> clearTimeout(timer);
  }, [navigation]);

  return (    
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight]}
      style={[commonStyles.container,commonStyles.centerContainer]}>    
      <View style={[onboardingStyles.logoBox, onboardingStyles.logoBoxLight]}>
        <MaterialCommunityIcons name="silverware-fork-knife" size={38} color={COLORS.primary}/>
      </View>
      <Text style={onboardingStyles.logo}>EatLocal</Text>
      <Text style={onboardingStyles.slogan}>NEIGHBORS FEEDING NEIGHBORS</Text>
      <Text style={onboardingStyles.description}> Bringing the warmth of your local vendors{"\n"}
    straight to your doorstep. </Text>
      <View style={onboardingStyles.loadingContainer}>
        <View style={onboardingStyles.loadingBar}/>
        <Text style={onboardingStyles.loadingText}>
            FINDING FRESH FLAVORS...
        </Text>
      </View>
    </LinearGradient>    
  );
}
