import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import profileApi from '../api/profile';
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
  FormImagePicker,
} from '../components/forms';
import colors from '../config/colors';
import Text from '../components/Text';
import useAuth from '../auth/useAuth';
import Screen from '../components/Screen';
import Button from '../components/Button';
import showOk from '../components/notifications/showOk';
import routes from '../navigation/routes';

function ProfileEditScreen({ navigation, route }) {
  const auth = useAuth();
  const [error, setError] = useState(null);
  const [logoChange, setLogoChange] = useState(false);

  const skipText = auth.user ? 'cancel' : 'skip';
  const titleText = auth.user ? 'title' : 'tr';

  const handleSubmit = async (moreInfo) => {
    const result = await profileApi.add(route.params.id, moreInfo, logoChange);
    if (!result.ok) return setError(result.data.error);
    setError(null);
    showOk(result.data.msg);
    if (auth.user) return navigation.navigate(routes.PROFILE.name);
    auth.logIn(route.params.token);
  };
  const handleSkip = () => {
    if (auth.user) return navigation.navigate(routes.PROFILE.name);
    auth.logIn(route.params.token);
  };

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>{titleText}</Text>
      <View style={styles.form}>
        <Form
          initialValues={{
            firstName: '',
            lastName: '',
            companyName: '',
            logoImg: [],
          }}
          onSubmit={handleSubmit}
        >
          <FormField
            icon="account"
            name="firstName"
            placeholder="firstName"
            firstValue={route.params.firstName}
          />
          <FormField
            icon="account-supervisor"
            name="lastName"
            placeholder="lastName"
            firstValue={route.params.lastName}
          />
          <View style={styles.separator}></View>
          <ErrorMessage error={error} visible={error} />
          <SubmitButton style={styles.submit} title="general.ok" />
        </Form>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={skipText}
          style={styles.button}
          backgroundColor="white"
          color="dark"
          style={styles.skip}
          onPress={handleSkip}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
    flex: 1,
  },
  title: {
    marginVertical: 30,
    fontSize: 26,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  separator: {
    marginBottom: 30,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skip: {
    borderWidth: 1,
    borderColor: colors.dark,
  },
  submit: {
    marginTop: 20,
  },
});

export default ProfileEditScreen;
