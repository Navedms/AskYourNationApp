import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Yup from 'yup';

import authApi from '../api/auth';
import Screen from '../components/Screen';
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from '../components/forms';
import Text from '../components/Text';
import useAuth from '../auth/useAuth';
import navigation from '../navigation/rootNavigation';
import routes from '../navigation/routes';
import showOk from '../components/notifications/showOk';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().min(6),
  newPassword: Yup.string()
    .required()
    .min(6)
    .notOneOf([Yup.ref('oldPassword')]),
  confirmPassword: Yup.string()
    .required()
    .min(6)
    .oneOf([Yup.ref('newPassword')]),
});

function ResetPasswordScreen() {
  const auth = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async ({ oldPassword, newPassword }) => {
    const result = await authApi.resetPassword(
      auth.user.id,
      oldPassword,
      newPassword
    );
    if (!result.ok) return setError(result.data.error);
    setError(null);

    showOk(result.data.msg);
    if (auth.user) return navigation.navigate(routes.PROFILE.name);
  };

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>ResetPasswordScreen.title</Text>
      <View style={styles.form}>
        <Form
          initialValues={{
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="oldPassword"
            placeholder={'ResetPasswordScreen.formField.oldPassword'}
            secureTextEntry
            textContentType="password"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock-open"
            name="newPassword"
            placeholder={'ResetPasswordScreen.formField.newPassword'}
            secureTextEntry
            textContentType="password"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock-check"
            name="confirmPassword"
            placeholder={'ResetPasswordScreen.formField.confirmPassword'}
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton
            title={'ResetPasswordScreen.formField.btn'}
            backgroundColor="primary"
          />
        </Form>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
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
    paddingBottom: 20,
    flex: 1,
  },
});

export default ResetPasswordScreen;
