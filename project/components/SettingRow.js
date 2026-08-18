import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import profileStyles from '../styles/profile';
import { COLORS } from '../styles/theme';

const SettingRow = ({
    icon,
    iconBgColor,
    iconColor = COLORS.primaryDark,
    label,
    type = 'chevron',
    value,
    switchValue,
    onToggle,
    onPress,
}) => {
    const isSwitchType = type === 'switch';

    return (
        <TouchableOpacity
            style={profileStyles.row}
            onPress={onPress}
            disabled={isSwitchType}
            activeOpacity={0.7}
        >
            <View style={[profileStyles.iconBox, { backgroundColor: iconBgColor }]}>
                <MaterialCommunityIcons name={icon} size={20} color={iconColor} style={profileStyles.icon} />
            </View>

            <Text style={profileStyles.label}>{label}</Text>

            {type === 'switch' && (
                <TouchableOpacity onPress={() => onToggle(!switchValue)} activeOpacity={0.7}>
                    <MaterialCommunityIcons
                        name={switchValue ? 'toggle-switch' : 'toggle-switch-off'}
                        size={50}
                        color={switchValue ? COLORS.primary : COLORS.neutral}
                    />
                </TouchableOpacity>
            )}

            {type === 'value' && (
                <View style={profileStyles.valueContainer}>
                    <Text style={profileStyles.valueText}>{value}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.neutral} />
                </View>
            )}

            {type === 'chevron' && (
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.neutral} />
            )}

            {type === 'link' && (
                <MaterialCommunityIcons name="open-in-new" size={18} color={COLORS.neutral} />
            )}
        </TouchableOpacity>
    );
};

export default SettingRow;