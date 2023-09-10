import React from 'react';
import { useFormikContext } from 'formik';

import Button, { AppButtonProps } from '../Button';

function SubmitButton({
  title,
  backgroundColor,
  style,
  fontWeight,
  fontSize,
  color,
  icon,
  iconColor,
  iconSize,
  disabled,
}: AppButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      title={title}
      onPress={handleSubmit}
      backgroundColor={backgroundColor}
      style={style}
      fontWeight={fontWeight}
      fontSize={fontSize}
      color={color}
      icon={icon}
      iconColor={iconColor}
      iconSize={iconSize}
      disabled={disabled}
    />
  );
}

export default SubmitButton;
