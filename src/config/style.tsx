import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';

import colors from './colors';

const { textDirection } = getLocales()[0];

export default {
  colors,
  rtlRow: {
    flexDirection:
      Platform.OS === 'android' && textDirection === 'rtl'
        ? 'row-reverse'
        : 'row',
  },
  text: {
    color: colors.black,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
  errorMsg: {
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: {
    fontWeight: Platform.OS === 'android' ? 'bold' : '600',
  },
};
