import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ProfileCard from '../components/ProfileCard';
import SettingRow from '../components/SettingRow';

import commonStyles from '../styles/common';
import profileStyles from '../styles/profile';
import { COLORS } from '../styles/theme';
import BackHeader from '../components/BackHeader';
import { fetchCurrentUser, clearCurrentUser } from '../store/userSlice';
import { logoutUser } from '../store/authSlice';
import { removeToken } from '../utils/tokenStorage';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.auth);
  const { currentUser, status, error } = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      if (authUser?.id) {
        dispatch(fetchCurrentUser(authUser.id));
      }
    }, [dispatch, authUser?.id]),
  );

  if (status === 'loading' && !currentUser) {
    return (
      <SafeAreaView
        style={commonStyles.screen}
        edges={['top', 'left', 'right']}
      >
        <View style={commonStyles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'failed' && !currentUser) {
    return (
      <SafeAreaView
        style={commonStyles.screen}
        edges={['top', 'left', 'right']}
      >
        <View style={commonStyles.container}>
          <Text>{error || 'Failed to load profile'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSignOut = async () => {
    logoutUser();
    dispatch(clearCurrentUser());
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'left', 'right']}>
      <BackHeader title="Settings" />

      <ScrollView
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >

        {currentUser && (
          <ProfileCard
            name={currentUser.fullName}
            email={currentUser.email}
            avatar={currentUser.avatar}
            onPress={() => navigation.navigate('EditProfile')}
          />
        )}

        <View style={profileStyles.divider}>
          <Text style={profileStyles.sectionTitle}>Preferences</Text>

          <View style={profileStyles.settingsRow}>

            <SettingRow
              iconBgColor={COLORS.primaryLighter}
              iconColor={COLORS.primaryDark}
              icon="bell-outline"
              label="Notifications"
              type="switch"
              switchValue={currentUser?.notificationEnabled ?? false}
              onToggle={(value) => {
                console.log('Notification toggled:', value);
              }}
            />

            <SettingRow
              icon="web"
              iconBgColor={COLORS.secondary}
              iconColor={COLORS.tertiary}
              label="Language"
              type="value"
              value="English (UK)"
              onPress={() => navigation.navigate('Language')}
            />
          </View>
        </View>

        <View style={profileStyles.divider}>
          <Text style={profileStyles.sectionTitle}>Account</Text>

          <View style={profileStyles.settingsRow}>

            <SettingRow
              icon="credit-card-outline"
              iconColor={COLORS.neutral}
              label="Payment Methods"
              type="chevron"
              onPress={() => navigation.navigate('PaymentMethods')}
            />

            <SettingRow
              icon="map-marker-outline"
              iconColor={COLORS.neutral}
              label="Saved Addresses"
              type="chevron"
              onPress={() => navigation.navigate('SavedAddresses')}
            />
          </View>
        </View>

        <View style={profileStyles.divider}>
          <Text style={profileStyles.sectionTitle}>About</Text>

          <View style={profileStyles.settingsRow}>
            <SettingRow
              icon="shield-check-outline"
              iconColor={COLORS.tertiary}
              label="Privacy Policy"
              type="link"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />

            <SettingRow
              icon="information-outline"
              iconColor={COLORS.tertiary}
              label="About EatLocal"
              type="chevron"
              onPress={() => navigation.navigate('About')}
            />

            <SettingRow
              icon="help-circle-outline"
              iconColor={COLORS.tertiary}
              label="Help & Support"
              type="chevron"
              onPress={() => navigation.navigate('Help')}
            />
          </View>
        </View>

        <TouchableOpacity
          style={profileStyles.signOutButton}
          onPress={handleSignOut}
        >
          <MaterialCommunityIcons
            name="logout"
            size={18}
            color={COLORS.error}
          />

          <Text style={profileStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
