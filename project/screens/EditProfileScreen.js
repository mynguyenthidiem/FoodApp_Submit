import React, { useEffect, useState } from 'react';

import {
  ScrollView,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';

import BackHeader from '../components/BackHeader';

import commonStyles from '../styles/common';
import profileStyles from '../styles/profile';

import { resolveImage } from '../utils/imageUrl';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { launchImageLibrary } from 'react-native-image-picker';
import { fetchCurrentUser, updateProfileAsync } from '../store/userSlice';
import { COLORS } from '../styles/theme';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.auth);
  const { currentUser, status, error } = useSelector(state => state.user);

  useEffect(() => {
    if (!currentUser && authUser?.id) {
      dispatch(fetchCurrentUser(authUser.id));
    }
  }, [dispatch, currentUser, authUser?.id]);


  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');

  const [avatar, setAvatar] = useState(null);


  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setFullName(currentUser.fullName ?? '');

    setEmail(currentUser.email ?? '');

    setPhone(currentUser.phone ?? '');

    setAddress(currentUser.address ?? '');
  }, [currentUser]);


  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }

    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }

    try {
      await dispatch(
        updateProfileAsync({
          id: currentUser.id,

          fullName: fullName.trim(),

          phone: phone.trim(),

          address: address.trim(),

          avatar,
        }),
      ).unwrap();

      Alert.alert('Success', 'Profile updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Update profile failed:', error);

      Alert.alert('Update Failed', error || 'Unable to update profile.');
    }
  };


  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0]);
      }
    } catch (error) {
      console.log('Pick image error:', error);

      Alert.alert('Error', 'Unable to select image.');
    }
  };


  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'left', 'right']}>
      <BackHeader title="Edit Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContainer}
      >
        <View style={profileStyles.avatarEditContainer}>
          <View style={profileStyles.editAvatarWrapper}>
            <Image
              source={
                avatar
                  ? {
                    uri: avatar.uri,
                  }
                  : resolveImage(currentUser?.avatar)
              }
              style={profileStyles.editAvatarImage}
            />
          </View>

          <TouchableOpacity
            style={profileStyles.editAvatarButton}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="camera"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View style={profileStyles.editForm}>
          <Text style={profileStyles.editFormLabel}>Full Name</Text>

          <TextInput
            style={profileStyles.editFormInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />
        </View>

        <View style={profileStyles.editForm}>
          <Text style={profileStyles.editFormLabel}>Email Address</Text>

          <TextInput
            style={[
              profileStyles.editFormInput,
              {
                backgroundColor: '#F2F2F2',
                color: '#888888',
              },
            ]}
            value={email}
            editable={false}
            selectTextOnFocus={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text
            style={{
              marginTop: 5,
              fontSize: 12,
              color: '#999999',
            }}
          >
            Email address cannot be changed.
          </Text>
        </View>

        <View style={profileStyles.editForm}>
          <Text style={profileStyles.editFormLabel}>Address</Text>

          <TextInput
            style={profileStyles.editFormInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
          />
        </View>

        <View style={profileStyles.editForm}>
          <Text style={profileStyles.editFormLabel}>Phone Number</Text>

          <TextInput
            style={profileStyles.editFormInput}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
          />
        </View>

        <TouchableOpacity
          style={[
            profileStyles.saveButton,
            status === 'loading' && {
              opacity: 0.6,
            },
          ]}
          onPress={handleSave}
          disabled={status === 'loading'}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="content-save"
            size={20}
            color={COLORS.white}
          />

          <Text style={profileStyles.saveButtonText}>
            {status === 'loading' ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <Text style={profileStyles.accountManagement}>Account Management</Text>

        <TouchableOpacity
          style={profileStyles.deleteAccountButton}
          onPress={() => { }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={16}
            color={COLORS.error}
          />

          <Text style={profileStyles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
