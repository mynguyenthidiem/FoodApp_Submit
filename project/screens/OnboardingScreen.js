import React, {useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import commonStyles from '../styles/common';
import onboardingStyles from '../styles/onboarding';

import onboardingData from '../data/onboardingData';

import OnboardingCard from '../components/OnboardingCard';
import CustomButton from '../components/CustomButton';

export default function OnboardingScreen({navigation, route}) {
  const [currentPage, setCurrentPage] = useState(0);
  const page = onboardingData[currentPage];
  const { userId } = route.params ?? {};

  const finishOnboarding = async () => {
    if (userId) {
      await AsyncStorage.setItem(`has_seen_onboarding_${userId}`, 'true');
    }

    navigation.replace('MainTabs');
  };

  return (    
    <SafeAreaView style={[commonStyles.screen, commonStyles.container, commonStyles.centerContainer]}>
      <OnboardingCard
        image={page.image}
        title={page.cardTitle}
        description={page.cardDescription}
      />
      <Text style={onboardingStyles.onboardTitle}> {page.title} </Text>
      <Text style={onboardingStyles.onboardDescription}> {page.description} </Text>
      <View style={onboardingStyles.dotContainer}>
        {onboardingData.map((_, index) => (
            <View
                key={index}
                style={[
                    onboardingStyles.dot,
                    index === currentPage && onboardingStyles.activeDot,
                ]}
            />
        ))}
      </View>
      <CustomButton
            title={
                currentPage === onboardingData.length - 1
                    ? "Get Started"
                    : "Next"
            }
            onPress={() => {
                if (currentPage < onboardingData.length - 1) {
                    setCurrentPage(currentPage + 1);
                } else {
                    finishOnboarding();
                }
            }}
        />
        <TouchableOpacity onPress={finishOnboarding}>
            <Text style={onboardingStyles.skipText}> Skip </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}