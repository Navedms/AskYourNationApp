import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Screen from '../components/Screen';
import HighScoresScreen from '../screens/HighScoresScreen';
import routes from './routes';

const Tab = createMaterialTopTabNavigator();

const HighScoresNavigator = () => {
  return (
    <Screen>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { textTransform: 'none' },
        }}
      >
        <Tab.Screen
          name={routes.HIGH_SCORES_TOTAL.name}
          component={HighScoresScreen}
          options={{
            title: routes.HIGH_SCORES_TOTAL.title,
            screen: routes.HIGH_SCORES_TOTAL.name,
          }}
        />
        <Tab.Screen
          name={routes.HIGH_SCORES_QUESTIONS.name}
          component={HighScoresScreen}
          options={{
            title: routes.HIGH_SCORES_QUESTIONS.title,
            screen: routes.HIGH_SCORES_QUESTIONS.name,
          }}
        />
        <Tab.Screen
          name={routes.HIGH_SCORES_ANSWERS.name}
          component={HighScoresScreen}
          options={{
            title: routes.HIGH_SCORES_ANSWERS.title,
            screen: routes.HIGH_SCORES_ANSWERS.name,
          }}
        />
      </Tab.Navigator>
    </Screen>
  );
};

export default HighScoresNavigator;
