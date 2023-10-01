import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';

import Screen from '../components/Screen';
import HighScoresScreen from '../screens/HighScoresScreen';
import routes from './routes';
import HighScoresQuestionsScreen from '../screens/HighScoresQuestionScreen';
import HighScoresAnswersScreen from '../screens/HighScoresAnswerScreen';

const Tab = createMaterialTopTabNavigator();
const { textDirection } = getLocales()[0];

const HighScoresNavigator = () => {
	if (Platform.OS === 'android' && textDirection === 'rtl') {
		return (
			<Screen>
				<Tab.Navigator
					initialRouteName={routes.HIGH_SCORES_TOTAL.name}
					screenOptions={{
						tabBarLabelStyle: { textTransform: 'none' },
					}}>
					<Tab.Screen
						name={routes.HIGH_SCORES_ANSWERS.name}
						component={HighScoresAnswersScreen}
						options={{
							title: routes.HIGH_SCORES_ANSWERS.title,
							screen: routes.HIGH_SCORES_ANSWERS.name,
						}}
					/>
					<Tab.Screen
						name={routes.HIGH_SCORES_QUESTIONS.name}
						component={HighScoresQuestionsScreen}
						options={{
							title: routes.HIGH_SCORES_QUESTIONS.title,
							screen: routes.HIGH_SCORES_QUESTIONS.name,
						}}
					/>
					<Tab.Screen
						name={routes.HIGH_SCORES_TOTAL.name}
						component={HighScoresScreen}
						options={{
							title: routes.HIGH_SCORES_TOTAL.title,
							screen: routes.HIGH_SCORES_TOTAL.name,
						}}
					/>
				</Tab.Navigator>
			</Screen>
		);
	} else {
		return (
			<Screen>
				<Tab.Navigator
					screenOptions={{
						tabBarLabelStyle: { textTransform: 'none' },
					}}>
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
						component={HighScoresQuestionsScreen}
						options={{
							title: routes.HIGH_SCORES_QUESTIONS.title,
							screen: routes.HIGH_SCORES_QUESTIONS.name,
						}}
					/>
					<Tab.Screen
						name={routes.HIGH_SCORES_ANSWERS.name}
						component={HighScoresAnswersScreen}
						options={{
							title: routes.HIGH_SCORES_ANSWERS.title,
							screen: routes.HIGH_SCORES_ANSWERS.name,
						}}
					/>
				</Tab.Navigator>
			</Screen>
		);
	}
};

export default HighScoresNavigator;
