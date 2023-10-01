import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import MyQuestionsScreen from '../screens/MyQuestionsScreen';
import QuestionAddEditScreen from '../screens/QuestionAddEditScreen';

const Stack = createStackNavigator();

const MyQuestionsNavigator = () => (
	<Stack.Navigator
		screenOptions={{
			headerShown: false,
			presentation: 'card',
		}}>
		<Stack.Screen
			name={routes.MY_QUESTIONS_MAIN.name}
			component={MyQuestionsScreen}
			options={{ title: routes.MY_QUESTIONS_MAIN.title }}
		/>
		<Stack.Screen
			name={routes.QUESTION_ADD_EDIT.name}
			component={QuestionAddEditScreen}
			options={{ title: routes.QUESTION_ADD_EDIT.title }}
		/>
	</Stack.Navigator>
);

export default MyQuestionsNavigator;
