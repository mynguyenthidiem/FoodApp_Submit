import React, { useCallback } from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import commonStyles from '../styles/common';
import profileStyles from '../styles/profile';
import {
  fetchCurrentUser,
  clearCurrentUser,
} from '../store/userSlice';
import { resolveImage } from '../utils/imageUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingRow from '../components/SettingRow';
import BackHeader from '../components/BackHeader';
import { COLORS } from '../styles/theme';
import { logoutUser } from '../store/authSlice';
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { user: authUser } = useSelector(state => state.auth);
  console.log('AUTH USER:', JSON.stringify(authUser));

  const { currentUser, status, error } = useSelector(state => state.user);
  console.log('CURRENT USER:', JSON.stringify(currentUser), 'STATUS:', status, 'ERROR:', error);
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
        <BackHeader title="Profile" />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }
  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      dispatch(clearCurrentUser());

      navigation.replace('Login');
    } catch (err) {
      console.log('LOGOUT ERROR:', err);
    }
  };
  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'left', 'right']}>
      <BackHeader title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContainer}
      >
        <View style={profileStyles.header}>
          <View style={profileStyles.avatarContainer}>
            <View style={profileStyles.profileAvatarWrapper}>
              <Image
                source={resolveImage(currentUser?.avatar)}
                style={profileStyles.profileScreenAvatar}
              />
            </View>

            <TouchableOpacity
              style={profileStyles.editAvatarButton}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          <Text style={profileStyles.name}>
            {currentUser?.fullName ?? 'User'}
          </Text>

          <Text style={profileStyles.email}>{currentUser?.email ?? ''}</Text>
        </View>

        {/* <View style={profileStyles.stats}>
          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statNumber}>24</Text>

            <Text style={profileStyles.statLabel}>ORDERS</Text>
          </View>

          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statNumber}>12</Text>

            <Text style={profileStyles.statLabel}>REVIEWS</Text>
          </View>

          <View style={profileStyles.statBox}>
            <Text style={profileStyles.statNumber}>5</Text>

            <Text style={profileStyles.statLabel}>BADGES</Text>
          </View>
        </View> */}

        <Text style={profileStyles.sectionTitle}>ACCOUNT SETTINGS</Text>

        <View style={profileStyles.settingsRow}>
          <SettingRow
            icon="order-bool-ascending-variant"
            label="My Orders"
            onPress={() => { }}
          />

          <SettingRow
            icon="credit-card-outline"
            label="Payment Methods"
            onPress={() => { }}
          />

          <SettingRow
            icon="map-marker-outline"
            label="Addresses"
            onPress={() => { }}
          />

          <SettingRow icon="heart-outline" label="Favorites" onPress={() => { navigation.navigate('Favorites'); }} />
        </View>

        <Text style={profileStyles.sectionTitle}>SUPPORT</Text>

        <View style={profileStyles.settingsRow}>
          <SettingRow
            icon="cog-outline"
            label="Settings"
            onPress={() => navigation.navigate('Settings')}
          />

          <SettingRow
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => { }}
          />
        </View>
        <TouchableOpacity style={profileStyles.logoutButton} onPress={handleSignOut}>
          <MaterialCommunityIcons name="logout" size={20} color="#b30000" />

          <Text style={profileStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
