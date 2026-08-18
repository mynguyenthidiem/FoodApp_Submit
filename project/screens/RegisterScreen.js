import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import commonStyles from '../styles/common';
import authStyles from '../styles/auth';
import { COLORS } from '../styles/theme';

import BackHeader from '../components/BackHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { register } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [agree, setAgree] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert(
        'Required Fields',
        'Please fill in all mandatory fields.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match. Please try again.',
      );
      return;
    }

    if (!agree) {
      Alert.alert(
        'Terms & Conditions',
        'Please accept the Terms of Service and Privacy Policy to continue.',
      );
      return;
    }

    try {
      setLoading(true);

      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || null,
      });


      navigation.replace('Login');
    } catch (err) {
      console.log('REGISTER ERROR:', err.response?.data);

      const message =
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Failed to register. Please check your information.';

      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top']}>
      <BackHeader title="Register" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            commonStyles.scrollContainer,
            commonStyles.centerContainer,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={commonStyles.title}>Create Account</Text>

          <Text style={commonStyles.subtitle}>
            Enter your details to start exploring local flavors.
          </Text>
          <View style={commonStyles.card}>
            <CustomInput
              label="Full name"
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
            />
            <CustomInput
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <CustomInput
              label="Phone number"
              placeholder="Enter your phone number"
              keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
            />
            <CustomInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <CustomInput
              label="Confirm password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={authStyles.checkboxRow}>
            <TouchableOpacity
              style={authStyles.checkbox}
              onPress={() => setAgree(!agree)}
            >
              {agree && (
                <MaterialIcons name="check" size={16} color={COLORS.heading} />
              )}
            </TouchableOpacity>
            <Text style={commonStyles.footerText}>I agree to the </Text>

            <Text style={commonStyles.link}>Terms of Service </Text>
            <Text style={commonStyles.footerText}>and </Text>

            <Text style={commonStyles.link}>Privacy Policy.</Text>
          </View>
          <CustomButton
            title="Sign Up"
            onPress={handleRegister}
            loading={loading}
          />
          <View style={authStyles.registerContainer}>
            <Text style={commonStyles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={commonStyles.link}> Log In </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}