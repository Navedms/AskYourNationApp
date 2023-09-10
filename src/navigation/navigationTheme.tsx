import { DefaultTheme } from '@react-navigation/native';
import colors from '../config/colors';

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.black,
    text: colors.black,
    background: colors.white,
  },
};
