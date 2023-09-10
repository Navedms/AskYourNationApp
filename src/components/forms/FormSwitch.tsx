import React, { useEffect } from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';

import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Text from '../Text';

function AppFormSwitch({
  firstValue,
  key,
  name,
  optionAfalse,
  colorA = colors.darkMedium,
  optionBtrue,
  colorB = colors.primary,
  backgroundColor = colors.light,
  border = 0,
  onSwitch,
  disabled,
  style,
}) {
  const { setFieldValue, errors, touched, values } = useFormikContext();

  const handleFirstValue = (firstValue) => {
    onSwitch(firstValue);
    setFieldValue(name, firstValue);
  };

  const handleOnSwitch = (text) => {
    setFieldValue(name, text);
    onSwitch(text);
  };

  useEffect(() => {
    handleFirstValue(firstValue);
  }, [firstValue]);

  return (
    <View
      style={[
        defaultStyle.rtlRow,
        styles.container,
        { backgroundColor: backgroundColor, borderWidth: border },
        style,
      ]}
    >
      <Text
        style={[
          styles.optionA,
          !values[name] && [defaultStyle.bold, { color: colors.black }],
        ]}
      >
        {optionAfalse}
      </Text>
      <Switch
        key={key}
        trackColor={{ false: colorA, true: colorB }}
        thumbColor={colors.white}
        ios_backgroundColor={colorA}
        onValueChange={handleOnSwitch}
        disabled={disabled}
        value={values[name]}
        style={styles.switch}
      />
      <Text
        style={[
          styles.optionB,
          values[name] && [defaultStyle.bold, { color: colors.black }],
        ]}
      >
        {optionBtrue}
      </Text>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 56,
  },
  switch: {
    marginHorizontal: 15,
  },
  optionA: {
    color: colors.darkMedium,
  },
  optionB: {
    color: colors.darkMedium,
  },
});

export default AppFormSwitch;
