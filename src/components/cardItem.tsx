import React, { useState, memo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Text from './Text';
import colors from '../config/colors';
import defaultStyle from '../config/style';
import Icon from './Icon';
import showOk from './notifications/showOk';

function CardItem({
  itemKey,
  upperTitle,
  title,
  subTitle,
  image,
  IconComponent,
  onPress,
  onLongPress,
  edit = false,
  renderLeftActions,
  closeAfterPress = true,
  bold = false,
  sizeImg = 70,
  marginVertical = 0,
  status,
  points,
  completion,
  suspicious,
}) {
  const [openSwipe, setOpenSwipe] = useState('gesture-swipe-right');
  let rowRefs = new Map();

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    showOk('okMsgText.copyLCodeToClipboard');
  };

  return (
    <Swipeable
      key={itemKey}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={() => setOpenSwipe('gesture-swipe-left')}
      onSwipeableClose={() => setOpenSwipe('gesture-swipe-right')}
      onBegan={() => {
        [...rowRefs.entries()].forEach(([key, ref]) => {
          if (key === itemKey && ref && closeAfterPress) ref.close();
        });
      }}
      ref={(ref) => {
        if (ref && !rowRefs.get(itemKey)) {
          rowRefs.set(itemKey, ref);
        }
      }}
    >
      <TouchableOpacity
        underlayColor={colors.light}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={!onPress && !onLongPress ? 1 : 0.5}
      >
        <View
          style={[
            styles.border,
            {
              marginVertical,
            },
            status && {
              backgroundColor: suspicious
                ? colors.lightRedBackground
                : status === 'complete'
                ? colors.lightGreenBackground
                : colors.light,
              borderColor: colors.darkMedium,
            },
          ]}
        >
          {upperTitle && (
            <Text
              style={[styles.upperTitle, defaultStyle.leftOrRight(18)]}
              numberOfLines={1}
            >
              {upperTitle}
            </Text>
          )}
          <View style={[defaultStyle.rtlRow, styles.container]}>
            <View style={[defaultStyle.rtlRow, styles.containerBody]}>
              {IconComponent}
              {image && image !== 'placeHolder' && (
                <Image
                  style={[styles.image, { width: sizeImg, height: sizeImg }]}
                  source={{ uri: image }}
                />
              )}
              {image === 'placeHolder' && (
                <Icon
                  name="camera-plus"
                  backgroundColor={colors.medium}
                  size={sizeImg}
                />
              )}
              <View
                style={[
                  styles.detailsContainer,
                  defaultStyle.rtlAlignItems,
                  {
                    marginTop: upperTitle ? 10 : 0,
                    width:
                      (image || IconComponent) && (edit || renderLeftActions)
                        ? '70%'
                        : !image &&
                          !IconComponent &&
                          !edit &&
                          !renderLeftActions
                        ? '90%'
                        : '80%',
                  },
                ]}
              >
                <Text
                  style={[styles.title, bold && defaultStyle.bold]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {subTitle && (
                  <Text style={styles.subTitle} numberOfLines={2}>
                    {subTitle}
                  </Text>
                )}
                {status && points && (
                  <View style={[defaultStyle.rtlRow, styles.statusContainer]}>
                    <MaterialCommunityIcons
                      color={
                        status === 'complete' ? colors.ok : colors.darkMedium
                      }
                      name={
                        status === 'complete' ? 'check-circle' : 'alert-circle'
                      }
                      size={18}
                    />
                    <Text style={styles.status}>
                      {`${translate(
                        `ReportsScreen.reportList.patrolStatus.${status}`
                      )} - ${translate(
                        'ReportsScreen.reportList.patrolStatus.pointsDone'
                      )} ${points} ${translate('general.points')} (${(
                        completion * 100
                      ).toFixed(0)}%)`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {edit && (
              <MaterialCommunityIcons
                color={colors.medium}
                name="lead-pencil"
                size={20}
              />
            )}
            {renderLeftActions && (
              <MaterialCommunityIcons
                color={colors.darkMedium}
                name={openSwipe}
                size={30}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    padding: 15,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  containerBody: {
    alignItems: 'center',
  },
  detailsContainer: {
    marginHorizontal: 10,
    justifyContent: 'center',
    width: '90%',
  },
  image: {
    borderRadius: 35,
  },
  subTitle: {
    textAlign: Platform.OS === 'android' ? 'auto' : 'right',
    color: colors.dark,
    fontSize: 16,
  },
  moreInfo: {
    textAlign: Platform.OS === 'android' ? 'auto' : 'right',
    color: colors.dark,
    fontSize: 14,
  },
  upperTitle: {
    textAlign: Platform.OS === 'android' ? 'auto' : 'right',
    position: 'absolute',
    top: 8,
    color: colors.dark,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    textAlign: 'right',
  },
  codesContainer: {
    marginTop: 15,
  },
  CopyTitle: {
    marginBottom: 2,
    justifyContent: 'space-around',
  },
  CopyArr: {
    width: '100%',
    justifyContent: 'space-around',
  },
  CopyText: {
    fontSize: 12,
    color: colors.dark,
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%',
  },
  status: {
    fontSize: 14,
    paddingHorizontal: 3,
  },
});

export default memo(CardItem);
