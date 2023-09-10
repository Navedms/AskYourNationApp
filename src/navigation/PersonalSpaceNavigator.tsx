import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Screen from '../components/Screen';
import ProfileNavigator from './ProfileNavigator';
import MyQuestionsNavigator from './MyQuestionsNavigator';
import routes from './routes';

const Tab = createMaterialTopTabNavigator();

const PersonalSpaceNavigator = () => {
  return (
    <Screen>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { textTransform: 'none' },
        }}
      >
        <Tab.Screen
          name={routes.PROFILE.name}
          component={ProfileNavigator}
          options={{
            title: routes.PROFILE.title,
          }}
        />
        <Tab.Screen
          name={routes.MY_QUESTIONS.name}
          component={MyQuestionsNavigator}
          options={{
            title: routes.MY_QUESTIONS.title,
          }}
        />
      </Tab.Navigator>
    </Screen>
  );
};

export default PersonalSpaceNavigator;
