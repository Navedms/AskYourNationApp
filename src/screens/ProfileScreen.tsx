import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
	BannerAd,
	BannerAdSize,
	TestIds,
} from 'react-native-google-mobile-ads';

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

const adUnitId = __DEV__
	? TestIds.BANNER
	: Platform.OS === 'ios'
	? 'ca-app-pub-4744918320429923/1826413524'
	: 'ca-app-pub-4744918320429923/9956981140';

function ProfileScreen({ navigation }: { navigation: any }) {
	const { user, setUser, logOut } = useAuth();
	const [loading, setLoading] = useState(false);
	const [sounds, setSounds] = useState(user?.sounds || false);
	const [error, setError] = useState<string | undefined>(undefined);
	const isFocused = useIsFocused();

	const getUser = async () => {
		setLoading(true);
		const result: ApiResponse<any> = await authApi.getUser('total');
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			setLoading(false);
			return setError('Network error: Unable to connect to the server');
		} else if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			setLoading(false);
			return setError(result.data.error);
		}
		setLoading(false);
		setError(undefined);
		setUser(result.data);
		setSounds(result.data.sounds);
		if (user?.getMoreDitails) {
			navigation.navigate(routes.PROFILE_EDIT.name, {
				...result.data,
			});
		}
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
			if (
				!result.ok &&
				result.problem === 'NETWORK_ERROR' &&
				!result.status
			) {
				setLoading(false);
				return setError(
					'Network error: Unable to connect to the server'
				);
			} else if (result.status === 401 || result.status === 403) {
				return logOut();
			} else if (result.data.error) {
				setLoading(false);
				return setError(result.data.error);
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
			if (
				!result.ok &&
				result.problem === 'NETWORK_ERROR' &&
				!result.status
			) {
				setLoading(false);
				return setError(
					'Network error: Unable to connect to the server'
				);
			} else if (result.status === 401 || result.status === 403) {
				return logOut();
			} else if (result.data.error) {
				setLoading(false);
				return setError(result.data.error);
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
		<Screen
			titleColor={colors.white}
			backgroundColor={colors.light}
			style={styles.screen}>
			<Activityindicator visible={loading} />
			<View style={styles.main}>
				{user?.firstName && (
					<CardItem
						title={`${user?.firstName} ${user?.lastName}`}
						subTitle={user?.nation?.name}
						edit
						bold
						style={{ width: '60%' }}
						image={user?.profilePic || 'placeHolder'}
						IconComponent={
							user?.nation?.flag && (
								<View
									style={[
										styles.flag,
										defaultStyle.marginStartRtl(-20),
									]}>
									<Text style={styles.flagText}>
										{user?.nation?.flag}
									</Text>
								</View>
							)
						}
						onPress={() =>
							navigation.navigate(routes.PROFILE_EDIT.name, {
								...user,
								sounds: sounds,
							})
						}
					/>
				)}
				{user?.firstName && (
					<CardItem
						title={user.email}
						IconComponent={
							<Icon
								name='email'
								backgroundColor={colors.primary}
							/>
						}
					/>
				)}
				{user?.firstName && (
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
				)}
				{user?.rank && (
					<CardItem
						title={`Your Rank: ${numberOrdinal(user?.rank)}`}
						subTitle={`points: ${numberFormat(
							user?.points?.total
						)}`}
						IconComponent={
							<Icon
								name='medal'
								backgroundColor={colors.secondary}
							/>
						}
					/>
				)}
				{user?.points && (
					<CardItem
						title={`Answered correctly ${numberFormat(
							user?.points?.answers
						)} questions`}
						subTitle={`You write ${numberFormat(
							user?.points?.questions
						)} questions`}
						IconComponent={
							<Icon
								name='star'
								backgroundColor={colors.secondary}
							/>
						}
					/>
				)}
				{user?.rank && (
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
				)}
				{error && (
					<View style={styles.errorContainer}>
						<Text style={[defaultStyle.errorMsg, styles.error]}>
							{error}
						</Text>
					</View>
				)}
			</View>
			<BannerAd
				unitId={adUnitId}
				size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
				requestOptions={{
					requestNonPersonalizedAdsOnly: true,
				}}
			/>
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
		alignSelf: 'flex-end',
		marginBottom: -10,
	},
	flagText: {
		fontSize: Platform.OS === 'android' ? 20 : 24,
		paddingBottom: Platform.OS === 'android' ? 2 : 0,
	},
	error: {
		color: colors.delete,
		textAlign: 'center',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ProfileScreen;
