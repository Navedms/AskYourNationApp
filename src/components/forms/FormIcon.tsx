import React from 'react';

import Icon from '../Icon';

function AppFormIcon({ icon, size, borderRadius, style, backgroundColor }) {
  return (
    <Icon
      name={icon}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      size={size}
      style={style}
    />
  );
}

export default AppFormIcon;
