import React, { useEffect, ComponentProps, ReactNode } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { useFormikContext } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Text from '../Text';

interface PlaceHolder {
  label: string;
  value: null;
  color: string;
}

interface Item {
  label: string;
  value: string;
  key?: number | string;
}
interface AppFormPickerProps {
  list: Item[];
  firstValue?: string;
  name: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  placeholder: PlaceHolder;
  border?: number;
  borderColor?: string;
  backgroundColor?: string;
  placeholderColor?: string;
  width?: number;
  fixedPadding?: number;
  disabled?: boolean;
  onChange?: (name: string, value: string) => void;
  style?: Object;
  onClose?: (value: string) => void;
  returnInArry?: boolean;
}

function AppFormPicker({
  list,
  firstValue,
  name,
  icon,
  placeholder,
  border = 1,
  borderColor = colors.dark,
  backgroundColor = colors.light,
  placeholderColor = colors.darkMedium,
  width = 1,
  fixedPadding = 40,
  disabled,
  onChange,
  style,
  returnInArry = false,
  onClose,
}: AppFormPickerProps) {
  const { setFieldValue, setFieldTouched, errors, touched, values } =
    useFormikContext();

  const windowWidth = (Dimensions.get('window').width - fixedPadding) * width;

  const handleFirstValue = (firstValue: string | undefined): void => {
    if (returnInArry) {
      setFieldValue(name, [firstValue]);
    } else {
      setFieldValue(name, firstValue);
    }
  };

  useEffect(() => {
    handleFirstValue(firstValue);
  }, [firstValue]);

  const handleValueChange = (value) => {
    onChange && onChange(name, value);
    setFieldValue(name, value);
    if (Platform.OS === 'android') {
      onClose && onClose(value);
    }
  };

  const handleOnClose = () => {
    onClose && onClose(values[name]);
    setFieldTouched(name);
  };
  const label = !!placeholder.label && !!values[name];

  return (
    <>
      <View
        style={[
          defaultStyle.rtlRow,
          styles.container,
          style,
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: border,
            width: windowWidth,
          },
        ]}
      >
        {label && (
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{placeholder.label}</Text>
          </View>
        )}
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={colors.dark}
            style={[styles.icon, label && { marginTop: 18, marginBottom: -8 }]}
          />
        )}
        <RNPickerSelect
          onValueChange={handleValueChange}
          onClose={handleOnClose}
          items={list}
          useNativeAndroidPickerStyle={false}
          placeholder={placeholder}
          itemKey={firstValue}
          disabled={disabled}
          style={{
            inputIOS: {
              width: windowWidth - 60,
              marginTop: label ? 5 : 0,
              marginBottom: label ? -5 : 0,
              ...defaultStyle.text,
              ...styles.select,
            },
            inputAndroid: {
              width: windowWidth - 80,
              marginTop: label ? 5 : 0,
              marginBottom: label ? -5 : 0,
              ...defaultStyle.text,
              ...styles.select,
            },
            iconContainer: {
              right: Platform.OS === 'android' ? windowWidth - 92 : 20,
              top: 10,
            },
            placeholder: {
              color: placeholderColor,
            },
          }}
          Icon={() => (
            <MaterialCommunityIcons name="menu-down" size={32} color="gray" />
          )}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 10,
    justifyContent: 'flex-start',
  },
  icon: {
    marginLeft: 10,
    marginRight: 14,
    marginVertical: 12,
  },
  select: {
    textAlign: 'left',
    marginHorizontal: 10,
    color: colors.dark,
    paddingVertical: 14,
  },
  labelContainer: {
    position: 'absolute',
    top: 5,
    left: 10,
  },
  label: {
    fontSize: 10,
    color: colors.dark,
  },
});

export default AppFormPicker;
