import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormikContext } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import defaultStyle from '../../config/style';
import TextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import Icon from '../Icon';

interface FormFieldProps {
  firstValue?: unknown;
  name: string;
  width?: string;
  backgroundColor?: string;
  icon?: string;
  border?: number;
  style?: Object;
  textStyle?: Object;
  generator?: boolean;
  camera?: boolean;
  onPressCamera?: () => void;
  onChangeCallBack?: (name: string, text: string) => void;
  placeholder?: string;
  placeholderColor?: string;
  numeric?: boolean;
  min?: number;
  max?: number;
  backgroundPlusBtnColor?: string;
  backgroundMinusBtnColor?: string;
  maxLength?: number;
  multiline?: boolean;
  disabled?: boolean;
  pointerEvents?: string;
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: string;
  textContentType?: string;
  password?: boolean;
  autoCapitalize?: string;
  onRemoveValue?: () => void;
}

function AppFormField({
  firstValue,
  name,
  width,
  backgroundColor,
  backgroundPlusBtnColor = colors.primary,
  backgroundMinusBtnColor = colors.primary,
  border = 1,
  style,
  textStyle,
  onChangeCallBack,
  onRemoveValue,
  placeholderColor = colors.darkMedium,
  placeholder,
  icon,
  numeric = false,
  min,
  max,
  disabled,
  ...otherProps
}: FormFieldProps) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  const [number, setNumber] = useState<number>(0);

  const handleFirstValue = (firstValue: unknown) => {
    if (numeric) {
      if (max !== undefined && Number(firstValue) > max) {
        setNumber(max);
        setFieldValue(name, max);
      } else if (min !== undefined && Number(firstValue) < min) {
        setNumber(min);
        setFieldValue(name, min);
      } else {
        setNumber(Number(firstValue));
        setFieldValue(name, firstValue);
      }
    } else {
      setFieldValue(name, firstValue);
    }
  };

  const handleOnChangeText = (text: string) => {
    if (numeric) {
      text = text.replace(/[^0-9]/g, '');
      if (max !== undefined && Number(text) > max) {
        setNumber(max);
        onChangeCallBack && onChangeCallBack(name, max.toString());
        setFieldValue(name, max);
      } else if (min !== undefined && Number(text) < min) {
        setNumber(min);
        onChangeCallBack && onChangeCallBack(name, min.toString());
        setFieldValue(name, min);
      } else {
        setNumber(Number(text));
        onChangeCallBack && onChangeCallBack(name, text);
        setFieldValue(name, text);
      }
    } else {
      text = text.replace(/[^0-9a-zA-Z .,;:)(!?@#$%^&~<>{}*+-_=/)""'']/gi, '');
      onChangeCallBack && onChangeCallBack(name, text);
      setFieldValue(name, text);
    }
  };

  useEffect(() => {
    handleFirstValue(firstValue);
  }, [firstValue, max, min]);

  const handlePlusMinus = (counter: number) => {
    if (max !== undefined && number + counter > max) {
      setNumber(max);
      setFieldValue(name, max);
      onChangeCallBack && onChangeCallBack(name, max.toString());
    } else if (min !== undefined && number + counter < min) {
      setNumber(min);
      setFieldValue(name, min);
      onChangeCallBack && onChangeCallBack(name, min.toString());
    } else {
      setNumber((prev) => prev + counter);
      setFieldValue(name, number + counter);
      onChangeCallBack && onChangeCallBack(name, (number + counter).toString());
    }
  };

  return (
    <>
      {numeric ? (
        <View
          style={[
            defaultStyle.rtlRow,
            styles.container,
            numeric && { justifyContent: 'center' },
          ]}
        >
          {numeric && (
            <TouchableOpacity
              style={[
                styles.numbersControl,
                { opacity: number === max ? 0.5 : 1 },
              ]}
              onPress={() => handlePlusMinus(1)}
              disabled={number === max}
            >
              <Icon
                name="plus"
                size={46}
                backgroundColor={backgroundPlusBtnColor}
              />
            </TouchableOpacity>
          )}
          <TextInput
            onBlur={() => setFieldTouched(name)}
            onChangeText={handleOnChangeText}
            value={numeric ? number?.toString() : values[name]}
            width={numeric ? 60 : width}
            backgroundColor={backgroundColor}
            border={border}
            style={style}
            textStyle={[numeric && { textAlign: 'center' }, textStyle]}
            placeholderColor={placeholderColor}
            placeholder={placeholder}
            keyboardType={numeric ? 'numeric' : 'default'}
            icon={icon}
            disabled={disabled}
            {...otherProps}
          />
          {numeric && (
            <TouchableOpacity
              style={[
                styles.numbersControl,
                { opacity: number === min ? 0.5 : 1 },
              ]}
              onPress={() => handlePlusMinus(-1)}
              disabled={number === min}
            >
              <Icon
                name="minus"
                size={46}
                backgroundColor={backgroundMinusBtnColor}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TextInput
          onBlur={() => setFieldTouched(name)}
          onChangeText={handleOnChangeText}
          value={values[name]}
          width={width}
          backgroundColor={backgroundColor}
          border={border}
          style={style}
          textStyle={textStyle}
          placeholderColor={placeholderColor}
          placeholder={placeholder}
          icon={icon}
          disabled={disabled}
          onRemoveValue={onRemoveValue}
          {...otherProps}
        />
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numbersControl: {
    paddingHorizontal: 8,
    marginTop: -8,
  },
});

export default AppFormField;
