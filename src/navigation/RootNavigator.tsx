import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import routes from './routes';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import WelcomeScreen from '../screens/login/WelcomeScreen';

interface RootNavigatorProps {
	user?: User;
}

export interface User {
	id: string;
	email?: string;
	firstName: string;
	lastName: string;
}

const Stack = createStackNavigator();

const RootNavigator = ({ user }: RootNavigatorProps) => (
	<Stack.Navigator
		screenOptions={{ headerShown: false, presentation: 'card' }}>
		<Stack.Screen
			name={routes.ROOT.name}
			component={user ? AppNavigator : AuthNavigator}
		/>
	</Stack.Navigator>
);

export default RootNavigator;
