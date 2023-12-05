import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{ headerShown: false, presentation: 'card' }}>
			<Stack.Screen
				name={routes.PROFILE_MAIN.name}
				component={ProfileScreen}
				options={{ title: routes.PROFILE_MAIN.title }}
			/>
			<Stack.Screen
				name={routes.PROFILE_EDIT.name}
				component={ProfileEditScreen}
				options={{ title: routes.PROFILE_EDIT.title }}
			/>
			<Stack.Screen
				name={routes.CHANGE_PASSWORD.name}
				component={ChangePasswordScreen}
				options={{ title: routes.CHANGE_PASSWORD.title }}
			/>
		</Stack.Navigator>
	);
};

export default ProfileNavigator;
