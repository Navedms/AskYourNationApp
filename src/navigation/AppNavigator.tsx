import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Fontisto,
} from '@expo/vector-icons';

import HighScoresNavigator from './HighScoresNavigator';
import MainScreen from '../screens/MainScreen';
import QuestionAddEditScreen from '../screens/QuestionAddEditScreen';
import routes from './routes';
import PersonalSpaceNavigator from './PersonalSpaceNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: -8,
          marginBottom: 2,
          padding: 0,
        },
      }}
    >
      <Tab.Screen
        name={routes.MAIN.name}
        component={MainScreen}
        options={{
          title: routes.MAIN.title,
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused
              ? routes.MAIN.activeIcon
              : routes.MAIN.icon;
            return focused ? (
              <FontAwesome5 name={iconName} color={color} size={size} />
            ) : (
              <MaterialCommunityIcons
                name={iconName}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={routes.QUESTION_ADD_EDIT.name}
        component={QuestionAddEditScreen}
        options={{
          title: routes.QUESTION_ADD_EDIT.title,
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused
              ? routes.QUESTION_ADD_EDIT.activeIcon
              : routes.QUESTION_ADD_EDIT.icon;
            return (
              <MaterialCommunityIcons
                name={iconName}
                style={focused && { transform: [{ scaleX: -1 }] }}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={routes.HIGH_SCORES.name}
        component={HighScoresNavigator}
        options={{
          title: routes.HIGH_SCORES.title,
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused
              ? routes.HIGH_SCORES.activeIcon
              : routes.HIGH_SCORES.icon;
            return focused ? (
              <FontAwesome5
                name={iconName}
                style={focused && { transform: [{ rotate: '-20deg' }] }}
                color={color}
                size={size}
              />
            ) : (
              <Fontisto name={iconName} color={color} size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name={routes.PERSONAL.name}
        component={PersonalSpaceNavigator}
        options={{
          title: routes.PERSONAL.title,
          tabBarIcon: ({ color, size, focused }) => {
            const iconName = focused
              ? routes.PERSONAL.activeIcon
              : routes.PERSONAL.icon;
            return <FontAwesome5 name={iconName} color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
