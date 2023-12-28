import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Fontisto,
} from '@expo/vector-icons';
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import HighScoresNavigator from './HighScoresNavigator';
import MainScreen from '../screens/MainScreen';
import authApi from '../api/auth';
import QuestionAddEditScreen from '../screens/QuestionAddEditScreen';
import routes from './routes';
import ProfileNavigator from './ProfileNavigator';
import MyQuestionsNavigator from './MyQuestionsNavigator';
import navigation from './rootNavigation';
import useAuth from '../auth/useAuth';
import { ApiResponse } from 'apisauce';

const Tab = createBottomTabNavigator();
const { textDirection } = getLocales()[0];

const AppNavigator = () => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const { setUser } = useAuth();
	const reciveNotification = () => {
		registerForNotifications();

		const subscriptionClick =
			Notifications.addNotificationResponseReceivedListener(
				async ({ notification }) => {
					subscriptionClick.remove();
					getUser();
					navigation.navigate(
						notification.request.content.categoryIdentifier
					);
				}
			);
	};

	const registerForNotifications = async () => {
		const settings = await Notifications.getPermissionsAsync();
		setHasPermission(
			settings.granted ||
				settings.ios?.status ===
					Notifications.IosAuthorizationStatus.PROVISIONAL
		);
	};

	const getUser = async () => {
		const result: ApiResponse<any> = await authApi.getUser('total');
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			return;
		} else if (result.data.error) {
			return;
		}
		setUser(result.data);
	};

	useEffect(() => {
		reciveNotification();
	}, []);

	if (Platform.OS === 'android' && textDirection === 'rtl') {
		return (
			<Tab.Navigator
				initialRouteName={routes.MAIN.name}
				screenOptions={{
					headerShown: false,
					tabBarLabelStyle: {
						fontSize: 11,
						marginTop: -8,
						marginBottom: 2,
						padding: 0,
					},
				}}>
				<Tab.Screen
					name={routes.PROFILE.name}
					component={ProfileNavigator}
					options={{
						title: routes.PROFILE.title,
						tabBarIcon: ({ color, size, focused }) => {
							const iconName = focused
								? routes.PROFILE.activeIcon
								: routes.PROFILE.icon;
							return (
								<FontAwesome5
									name={iconName}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
				<Tab.Screen
					name={routes.MY_QUESTIONS.name}
					component={MyQuestionsNavigator}
					options={{
						title: routes.MY_QUESTIONS.title,
						tabBarIcon: ({ color, size, focused }) => {
							const iconName = focused
								? routes.MY_QUESTIONS.activeIcon
								: routes.MY_QUESTIONS.icon;
							return (
								<MaterialCommunityIcons
									name={iconName}
									style={
										focused && {
											transform: [{ rotate: '10deg' }],
										}
									}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
				<Tab.Screen
					name={routes.QUESTION_ADD.name}
					component={QuestionAddEditScreen}
					options={{
						title: routes.QUESTION_ADD.title,
						tabBarIcon: ({ color, size, focused }) => {
							const iconName = focused
								? routes.QUESTION_ADD.activeIcon
								: routes.QUESTION_ADD.icon;
							return (
								<MaterialCommunityIcons
									name={iconName}
									style={
										focused && {
											transform: [{ rotate: '-45deg' }],
										}
									}
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
									style={
										focused && {
											transform: [{ scaleX: -1 }],
										}
									}
									color={color}
									size={size}
								/>
							) : (
								<Fontisto
									name={iconName}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
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
								<FontAwesome5
									name={iconName}
									color={color}
									size={size}
								/>
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
			</Tab.Navigator>
		);
	} else {
		return (
			<Tab.Navigator
				initialRouteName={routes.MAIN.name}
				screenOptions={{
					headerShown: false,
					tabBarLabelStyle: {
						fontSize: 11,
						marginTop: -8,
						marginBottom: 2,
						padding: 0,
					},
				}}>
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
								<FontAwesome5
									name={iconName}
									color={color}
									size={size}
								/>
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
									style={
										focused && {
											transform: [{ scaleX: -1 }],
										}
									}
									color={color}
									size={size}
								/>
							) : (
								<Fontisto
									name={iconName}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
				<Tab.Screen
					name={routes.QUESTION_ADD.name}
					component={QuestionAddEditScreen}
					options={{
						title: routes.QUESTION_ADD.title,
						tabBarIcon: ({ color, size, focused }) => {
							const iconName = focused
								? routes.QUESTION_ADD.activeIcon
								: routes.QUESTION_ADD.icon;
							return (
								<MaterialCommunityIcons
									name={iconName}
									style={
										focused && {
											transform: [{ rotate: '-45deg' }],
										}
									}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
				<Tab.Screen
					name={routes.MY_QUESTIONS.name}
					component={MyQuestionsNavigator}
					options={{
						title: routes.MY_QUESTIONS.title,
						tabBarIcon: ({ color, size, focused }) => {
							const iconName = focused
								? routes.MY_QUESTIONS.activeIcon
								: routes.MY_QUESTIONS.icon;
							return (
								<MaterialCommunityIcons
									name={iconName}
									style={
										focused && {
											transform: [{ rotate: '10deg' }],
										}
									}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
				<Tab.Screen
					name={routes.PROFILE.name}
					component={ProfileNavigator}
					options={{
						title: routes.PROFILE.title,
						tabBarIcon: ({ color, size, focused }) => {
							const iconName = focused
								? routes.PROFILE.activeIcon
								: routes.PROFILE.icon;
							return (
								<FontAwesome5
									name={iconName}
									color={color}
									size={size}
								/>
							);
						},
					}}
				/>
			</Tab.Navigator>
		);
	}
};

export default AppNavigator;
