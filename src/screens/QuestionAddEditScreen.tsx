import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Yup from 'yup';

import showOk from '../components/notifications/showOk';
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from '../components/forms';
import Screen from '../components/Screen';
import Text from '../components/Text';
import Button from '../components/Button';
import defaultStyle from '../config/style';
import colors from '../config/colors';
import routes from '../navigation/routes';
import askBeforeDelete from '../components/askBeforeDelete';

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
});

function QuestionAddEditScreen({ navigation, route }) {
  const item = route.params || {};

  const [error, setError] = useState(null);
  const [logoChange, setLogoChange] = useState(false);

  const handleSubmit = async (employee) => {
    const result = item.edit
      ? await employeeNameApi.update(item, employee, logoChange)
      : await employeeNameApi.post(item, employee, logoChange);
    if (!result.ok) return setError(result.data.error);
    setError(null);
    showOk(result.data.msg);
    return navigation.navigate(routes.MY_QUESTIONS.name);
  };

  const handleDeleteOnePress = async () => {
    const answer = await askBeforeDelete(
      'alerts.deleteEmployee.fromSite.title',
      'alerts.deleteEmployee.fromSite.text'
    );
    if (answer) {
      if (answer === 'pass') return;
      const result = await employeeNameApi.remove(item);
      if (!result.ok) return setError(result.data.error);
      setError(null);
      showOk(result.data.msg);
      return navigation.navigate(routes.MY_QUESTIONS.name);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={[defaultStyle.rtlRow, styles.header]}>
          <View style={styles.button}>
            <Button
              title=""
              fontWeight="normal"
              color="dark"
              iconSize={28}
              iconColor="black"
              backgroundColor="white"
              icon="close"
              onPress={() => navigation.navigate(routes.MY_QUESTIONS.name)}
            />
          </View>
          <Text style={defaultStyle.bold}>
            {item.edit
              ? routes.QUESTION_ADD_EDIT.editTitle
              : routes.QUESTION_ADD_EDIT.title}
          </Text>
          <View style={styles.button}></View>
        </View>
      </View>
      <View style={styles.form}>
        <Form
          initialValues={{ name: '', yalamNum: '', profilePic: [] }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <FormField
            icon="account"
            name="name"
            placeholder="name"
            firstValue={item.name}
          />
          <View style={styles.separator}></View>
          <ErrorMessage error={error} visible={error} />
          <SubmitButton style={styles.submit} title="general.ok" />
        </Form>
      </View>
      <View style={styles.buttonContainer}>
        {!item.edit && (
          <Button
            title="managementEditUserScreen.btn.selectEmployee.fromList"
            backgroundColor="dark"
            color="white"
            onPress={() =>
              navigation.navigate(
                routes.MANAGEMENT_USER_EX_LIST_SCREEN.name,
                item
              )
            }
          />
        )}
        {item.edit && (
          <Button
            title="managementEditUserScreen.btn.deletePatrol.fromSite"
            backgroundColor="delete"
            color="white"
            onPress={handleDeleteOnePress}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    paddingRight: 10,
    paddingLeft: 10,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 60,
  },
  submit: {
    marginTop: 20,
    backgroundColor: colors.secondary,
  },
  title: {
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default QuestionAddEditScreen;
