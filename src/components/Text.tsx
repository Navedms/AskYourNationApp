import React from 'react';
import { Text } from 'react-native';

import defaultStyle from '../config/style';

interface Text {
  children: string;
  style?: Object;
  numberOfLines?: number;
}

function AppText({ children, style, ...otherProps }: Text) {
  return (
    <Text style={[defaultStyle.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

export default AppText;
