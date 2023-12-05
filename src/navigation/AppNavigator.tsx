import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	MaterialCommunityIcons,
	FontAwesome5,
	Fontisto,
} from '@expo/vector-icons';
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';

import HighScoresNavigator from './HighScoresNavigator';
import MainScreen from '../screens/MainScreen';
import QuestionAddEditScreen from '../screens/QuestionAddEditScreen';
import routes from './routes';
import MyQuestionsScreen from '../screens/MyQuestionsScreen';
import ProfileNavigator from './ProfileNavigator';
import MyQuestionsNavigator from './MyQuestionsNavigator';

const Tab = createBottomTabNavigator();
const { textDirection } = getLocales()[0];

const AppNavigator = () => {
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
