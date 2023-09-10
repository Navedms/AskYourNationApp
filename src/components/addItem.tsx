import React, { ComponentProps } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import defaultStyle from '../config/style';

interface AddItemProps {
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor?: string;
  iconSize?: number;
  onPress: () => void;
  backgroundColor: string;
}

function AddItem({
  iconName,
  iconColor = colors.white,
  iconSize = 36,
  onPress,
  backgroundColor = colors.primary,
}: AddItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.add, { backgroundColor: backgroundColor }]}>
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    alignItems: 'flex-start',
    width: 60,
    paddingHorizontal: 15,
  },
  add: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: colors.medium,
    shadowRadius: 12,
    shadowOpacity: 0.7,
    borderColor: colors.light,
    borderWidth: 1,
  },
});

export default AddItem;
