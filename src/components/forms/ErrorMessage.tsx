import React from 'react';
import { StyleSheet } from 'react-native';
import colors from '../../config/colors';

import Text from '../Text';

interface ErrorMessageProps {
  error?: string;
  visible: boolean;
  style?: any;
}

function ErrorMessage({ error, visible, style }: ErrorMessageProps) {
  if (!visible || !error) return null;

  return <Text style={[styles.error, style]}>{error}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: colors.delete,
    textAlign: 'center',
  },
});

export default ErrorMessage;
