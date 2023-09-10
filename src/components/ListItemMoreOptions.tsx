import React, { ComponentProps } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import defaultStyle from '../config/style';

interface ListItemMoreOptionsProps {
  onPressEdit: () => void;
  onPressDelete: () => void;
  onPressPatrol?: () => void;
  onPressUser?: () => void;
  deleteme?: boolean;
  edit?: string;
  editUser?: boolean;
  editPatrol?: boolean;
  editIcon?: ComponentProps<typeof MaterialIcons>['name'];
}

function ListItemMoreOptions({
  onPressEdit,
  onPressDelete,
  onPressPatrol,
  onPressUser,
  deleteme,
  edit,
  editUser,
  editPatrol,
  editIcon = 'settings',
}: ListItemMoreOptionsProps) {
  return (
    <View style={defaultStyle.rtlRow}>
      {edit && (
        <TouchableWithoutFeedback onPress={onPressEdit}>
          <View style={styles.addSite}>
            <MaterialIcons name={editIcon} size={28} color={colors.white} />
          </View>
        </TouchableWithoutFeedback>
      )}

      {deleteme && (
        <TouchableWithoutFeedback onPress={onPressDelete}>
          <View style={styles.deleteSite}>
            <MaterialIcons name="delete" size={28} color={colors.white} />
          </View>
        </TouchableWithoutFeedback>
      )}

      {editPatrol && (
        <TouchableWithoutFeedback onPress={onPressPatrol}>
          <View style={styles.addPatrol}>
            <MaterialIcons
              name="add-location-alt"
              size={28}
              color={colors.white}
            />
          </View>
        </TouchableWithoutFeedback>
      )}

      {editUser && (
        <TouchableWithoutFeedback onPress={onPressUser}>
          <View style={styles.addUserName}>
            <MaterialIcons
              name="person-add-alt-1"
              size={28}
              color={colors.white}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addSite: {
    width: 70,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteSite: {
    width: 70,
    backgroundColor: colors.delete,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPatrol: {
    width: 70,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addUserName: {
    width: 70,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListItemMoreOptions;
