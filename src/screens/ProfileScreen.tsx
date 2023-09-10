import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';

import profileApi from '../api/profile';
import useAuth from '../auth/useAuth';
import NoResults from '../components/NoResults';
import Screen from '../components/Screen';
import defaultStyle from '../config/style';
import CardItem from '../components/cardItem';
import Icon from '../components/Icon';
import colors from '../config/colors';
import routes from '../navigation/routes';

function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();
  const { user, logOut } = useAuth();
  const [profile, setProfile] = useState();

  const apiProfile = async () => {
    const response = await profileApi.get(user.admin);
    setResponse(response);
  };
  const setResponse = async (response) => {
    if (!response.ok) return setError(response.data.error);
    setError(null);

    let result = response.data;
    const listLength = await SitesApi.getNumsites(result.id);
    if (!listLength) {
      result.activeSites = 0;
    } else {
      result.activeSites = listLength.data.listLength;
    }
    setProfile(result);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    apiProfile();
  }, [navigation, isFocused]);

  return (
    <Screen style={styles.screen}>
      {/* {error && <NoResults title={error} iconName="close-circle" />}
      {profile && (
        <>
          <View style={styles.main}>
            <CardItem
              image={renderLogoImg(profile.logoImg)}
              title={renderName(
                profile.firstName,
                profile.lastName,
                profile.name
              )}
              subTitle={renderRole(user.admin, profile.companyName)}
              bold={true}
              edit={user.admin === 'patrol' ? false : true}
              marginVertical={20}
              onPress={
                user.admin === 'patrol'
                  ? undefined
                  : () => navigation.navigate(routes.PROFILE_EDIT.name, profile)
              }
            />
            {user.admin !== 'patrol' && (
              <CardItem
                title={renderLimitSites(
                  profile.activeSites,
                  profile.limitSites
                )}
                subTitle={renderExpiredDate(profile.expiredDate)}
                IconComponent={
                  <Icon
                    name={'shield-key'}
                    backgroundColor={colors.secondary}
                  />
                }
              />
            )}
            {user.admin !== 'patrol' && (
              <CardItem
                title={profile.email}
                IconComponent={
                  <Icon name={'email'} backgroundColor={colors.primary} />
                }
              />
            )}
            {user.admin !== 'patrol' && (
              <CardItem
                title="profileScreen.password.change"
                edit
                IconComponent={
                  <Icon name={'lock-open'} backgroundColor={colors.primary} />
                }
                onPress={() =>
                  navigation.navigate(routes.RESET_PASSWORD.name, profile)
                }
              />
            )}
          </View>
          <CardItem
            title={`${settings.app.name} v${settings.app.version}`}
            subTitle="profileScreen.update"
            image={`${settings.server.url}/assets/logoApp.png`}
            sizeImg={40}
          />
        </>
      )} */}
      <CardItem
        title="profileScreen.logOut"
        IconComponent={<Icon name="logout" backgroundColor={colors.medium} />}
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    backgroundColor: defaultStyle.colors.light,
  },
  main: {
    flex: 1,
  },
});

export default ProfileScreen;
