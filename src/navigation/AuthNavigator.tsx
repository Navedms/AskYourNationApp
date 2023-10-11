import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/login/WelcomeScreen';
import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen';
import colors from '../config/colors';
import routes from './routes';

const Stack = createStackNavigator();
const AuthNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen
			name={routes.WELCOME.name}
			component={WelcomeScreen}
			options={{ headerShown: false, title: routes.WELCOME.title }}
		/>
		<Stack.Screen
			name={routes.FORGOT_PASSWORD.name}
			component={ForgotPasswordScreen}
			options={{
				title: routes.FORGOT_PASSWORD.title,
				headerStyle: {
					backgroundColor: colors.primary,
				},
				headerTintColor: colors.white,
			}}
		/>
	</Stack.Navigator>
);

export default AuthNavigator;
