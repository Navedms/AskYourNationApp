import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import useAuth from '../auth/useAuth';
import Screen from '../components/Screen';
import defaultStyle from '../config/style';
import CardItem from '../components/cardItem';
import Icon from '../components/Icon';
import colors from '../config/colors';
import { ApiResponse } from 'apisauce';
import authApi from '../api/auth';
import Text from '../components/Text';
import routes from '../navigation/routes';
import numberOrdinal from '../utility/numberOrdinal';
import numberFormat from '../utility/numberFormat';
import showOk from '../components/notifications/showOk';
import askBeforeDelete from '../components/askBeforeDelete';
import Activityindicator from '../components/Activityindicator';

function ProfileScreen({ navigation }: { navigation: any }) {
	const { user, setUser, logOut } = useAuth();
	const [loading, setLoading] = useState(false);
	const [sounds, setSounds] = useState(user?.sounds || false);
	const [error, setError] = useState<string | undefined>(undefined);
	const isFocused = useIsFocused();

	const getUser = async () => {
		setLoading(true);
		const result: ApiResponse<any> = await authApi.getUser('total');
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			setLoading(false);
			return setError(result.data.error);
		} else if (!result.ok) {
			setLoading(false);
			return setError('Network error: Unable to connect to the server');
		}
		setLoading(false);
		setError(undefined);
		setUser(result.data);
		setSounds(result.data.sounds);
	};

	const handleDeleteAccount = async () => {
		const answer = await askBeforeDelete(
			'Delete account',
			'Are you sure you want to delete the account? This email address will no longer be used',
			sounds
		);
		if (answer && user) {
			if (answer === 'pass') return;
			setLoading(true);
			const result: ApiResponse<any> = await authApi.deleteAccount(
				user.id
			);
			if (result.status === 401 || result.status === 403) {
				return logOut();
			} else if (result.data.error) {
				setLoading(false);
				return setError(result.data.error);
			} else if (!result.ok) {
				setLoading(false);
				return setError(
					'Network error: Unable to connect to the server'
				);
			}
			setLoading(false);
			setError(undefined);
			showOk(result.data.message, user.sounds);
			return logOut();
		}
	};

	const handleSounds = async (value: boolean) => {
		if (user) {
			setLoading(true);
			setSounds(value);
			const result: ApiResponse<any> = await authApi.setSounds(
				user.id,
				value
			);
			if (result.status === 401 || result.status === 403) {
				return logOut();
			} else if (result.data.error) {
				setLoading(false);
				return setError(result.data.error);
			} else if (!result.ok) {
				setLoading(false);
				return setError(
					'Network error: Unable to connect to the server'
				);
			}
			setLoading(false);
			setError(undefined);
			showOk(result.data.message, value);
		}
	};

	useEffect(() => {
		getUser();
	}, [navigation, isFocused]);

	return (
		<Screen style={styles.screen}>
			<Activityindicator visible={loading} />
			<View style={styles.main}>
				<CardItem
					title={`${user?.firstName} ${user?.lastName}`}
					subTitle={user?.nation?.name}
					edit
					IconComponent={
						<View style={styles.flag}>
							<Text style={styles.flagText}>
								{user?.nation?.flag}
							</Text>
						</View>
					}
					onPress={() =>
						navigation.navigate(routes.PROFILE_EDIT.name, {
							...user,
							sounds: sounds,
						})
					}
				/>
				<CardItem
					title={user.email}
					IconComponent={
						<Icon name='email' backgroundColor={colors.primary} />
					}
				/>
				<CardItem
					title='Change Password'
					edit
					IconComponent={
						<Icon
							name='lock-open'
							backgroundColor={colors.primary}
						/>
					}
					onPress={() =>
						navigation.navigate(routes.CHANGE_PASSWORD.name, {
							...user,
							sounds: sounds,
						})
					}
				/>
				<CardItem
					title={`Your Rank: ${numberOrdinal(user?.rank)}`}
					subTitle={`points: ${numberFormat(user?.points?.total)}`}
					IconComponent={
						<Icon name='medal' backgroundColor={colors.secondary} />
					}
				/>
				<CardItem
					title={`Answered correctly ${numberFormat(
						user?.points?.answers
					)} questions`}
					subTitle={`You write ${numberFormat(
						user?.points?.questions
					)} questions`}
					IconComponent={
						<Icon name='star' backgroundColor={colors.secondary} />
					}
				/>
				<CardItem
					title='Sound Effects'
					IconComponent={
						<Icon
							name='volume-high'
							backgroundColor={colors.primary}
						/>
					}
					SwitchComponent={
						<Switch
							key='sounds'
							trackColor={{
								false: colors.medium,
								true: colors.primary,
							}}
							disabled={loading}
							thumbColor={colors.white}
							ios_backgroundColor={colors.medium}
							onValueChange={handleSounds}
							value={sounds}
						/>
					}
				/>
			</View>
			<CardItem
				title='Sign Out'
				IconComponent={
					<Icon name='logout' backgroundColor={colors.dark} />
				}
				onPress={() => logOut()}
			/>
			<CardItem
				title='Delete Account'
				IconComponent={
					<Icon name='delete' backgroundColor={colors.delete} />
				}
				onPress={handleDeleteAccount}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	screen: {
		width: '100%',
		backgroundColor: defaultStyle.colors.light,
		paddingTop: 0,
	},
	main: {
		flex: 1,
	},
	flag: {
		backgroundColor: colors.light,
		height: 40,
		width: 40,
		borderRadius: 20,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagText: {
		fontSize: Platform.OS === 'android' ? 20 : 24,
	},
});

export default ProfileScreen;
