import React, { ComponentProps, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import defaultStyle from '../config/style';
import Text from './Text';
import { TouchableOpacity } from 'react-native';

interface AppTextInputProps {
  value: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  backgroundColor?: string;
  border?: number;
  width?: number | string;
  noLabel?: boolean;
  style?: Object;
  textStyle?: Object;
  placeholderColor?: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  secureTextEntry?: boolean;
  onRemoveValue?: () => void;
  pointerEvents?: string;
}

function AppTextInput({
  icon,
  value,
  backgroundColor = colors.light,
  border = 0,
  width = '100%',
  noLabel = false,
  style,
  textStyle,
  placeholderColor,
  placeholder,
  maxLength,
  disabled,
  secureTextEntry,
  onRemoveValue,
  ...otherProps
}: AppTextInputProps) {
  const [secureTextEntryType, setSecureTextEntryType] = useState<boolean>(
    secureTextEntry ? true : false
  );
  const label = !!placeholder && !!value && !noLabel;

  return (
    <View
      style={[
        defaultStyle.rtlRow,
        styles.container,
        {
          backgroundColor: backgroundColor,
          borderWidth: border,
          width: width,
        },
        style,
      ]}
    >
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{placeholder}</Text>
        </View>
      )}
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={colors.dark}
          style={[styles.icon, label && { marginTop: 8, marginBottom: -8 }]}
        />
      )}
      <TextInput
        value={value}
        editable={!disabled}
        placeholderTextColor={placeholderColor}
        style={[
          defaultStyle.text,
          styles.input,
          textStyle,
          label && { marginTop: 5, marginBottom: -5 },
        ]}
        placeholder={placeholder}
        maxLength={maxLength}
        secureTextEntry={secureTextEntryType}
        {...otherProps}
      />
      {onRemoveValue && (
        <TouchableOpacity
          onPress={() => onRemoveValue()}
          disabled={value ? false : true}
        >
          <MaterialCommunityIcons
            name="delete"
            size={28}
            color={value ? colors.delete : colors.disabled}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setSecureTextEntryType(!secureTextEntryType)}
        >
          <MaterialCommunityIcons
            name={secureTextEntryType ? 'eye' : 'eye-off'}
            size={28}
            color={colors.dark}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {maxLength && (
        <Text
          style={[
            styles.maxLength,
            {
              color: value?.length === maxLength ? colors.delete : colors.dark,
            },
          ]}
        >{`${value?.length || 0}/${maxLength}`}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 10,
    justifyContent: 'flex-start',
  },
  icon: {
    marginHorizontal: 12,
  },
  input: {
    textAlign: 'left',
    marginHorizontal: 10,
    color: colors.dark,
    flex: 1,
    flexWrap: 'wrap',
  },
  labelContainer: {
    position: 'absolute',
    top: 5,
    left: 10,
  },
  maxLength: {
    position: 'absolute',
    bottom: -16,
    right: 1,
    fontSize: 9,
  },
  label: {
    fontSize: 10,
    color: colors.dark,
  },
});

export default AppTextInput;
