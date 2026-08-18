import React from "react";
import { View, Text, TextInput } from "react-native";

import {COLORS} from "../styles/theme";
import commonStyles from "../styles/common";
import authStyles from "../styles/auth";

export default function CustomInput({
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  value,
  onChangeText,
}) {
  return (
    <View>
      <Text style={commonStyles.label}>{label}</Text>

      <View style={authStyles.inputContainer}>
        <TextInput
          style={authStyles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}