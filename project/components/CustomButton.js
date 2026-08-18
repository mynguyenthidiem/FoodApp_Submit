import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import commonStyles from "../styles/common";
import {COLORS} from "../styles/theme";

export default function CustomButton({ title, onPress, disabled = false, loading = false }) {
  return (
    <TouchableOpacity
      style={[commonStyles.button, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white ?? "#fff"} />
      ) : (
        <Text style={commonStyles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}