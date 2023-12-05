import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import * as SplashScreen from 'expo-splash-screen';
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';

import { navigationRef } from './src/navigation/rootNavigation';
import navigationTheme from './src/navigation/navigationTheme';
import authStorage from './src/auth/storage';
import AuthContext from './src/auth/context';
import RootNavigator, { User } from './src/navigation/RootNavigator';
import { fetchPackageJsonContentVersion, gotoStore } from './src/api/updateApp';
import Modal from './src/components/AppModal';
import Text from './src/components/Text';
import Button from './src/components/Button';
import settings from './package.json';
import colors from './src/config/colors';
import { decode } from 'base-64';
global.atob = decode;

const adUnitId =
	Platform.OS === 'ios'
		? 'ca-app-pub-4744918320429923/4821050050'
		: 'ca-app-pub-4744918320429923/2790468848';

const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
	requestNonPersonalizedAdsOnly: true,
	keywords: ['games', 'culture', 'travel', 'education', 'learning', 'food'],
});

export default function App() {
	const [user, setUser] = useState<User>();
	const [isReady, setIsReady] = useState<boolean>(false);
	const [openVersion, setOpenVersion] = useState<boolean>(false);
	const [isNewVersion, setIsNewVersion] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = appOpenAd.addAdEventListener(
			AdEventType.LOADED,
			() => {
				appOpenAd.show();
			}
		);
		appOpenAd.load();
		return unsubscribe;
	}, []);

	const restoreUser = async () => {
		const user = await authStorage.getUser();
		if (user) setUser(user);
	};

	const checkVersionUpdate = async () => {
		const newVersion = await fetchPackageJsonContentVersion();
		if (
			Number(settings.version.split('.').join('')) <
			Number(newVersion.split('.').join(''))
		) {
			setIsNewVersion(newVersion);
			setOpenVersion(true);
		} else {
			setIsNewVersion(null);
		}
	};

	useEffect(() => {
		async function prepare() {
			try {
				await SplashScreen.preventAutoHideAsync();
				await restoreUser();
				await checkVersionUpdate();
			} catch (e) {
				console.warn(e);
			} finally {
				setIsReady(true);
				await SplashScreen.hideAsync();
			}
		}

		prepare();
	}, []);

	if (!isReady) {
		return null;
	}

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			<NavigationContainer ref={navigationRef} theme={navigationTheme}>
				<StatusBar
					translucent={true}
					backgroundColor={colors.opacity}
					barStyle={'dark-content'}
				/>
				<RootNavigator user={user} />
				<FlashMessage position='bottom' />
				<Modal
					visible={openVersion}
					setVisible={setOpenVersion}
					closeBtnText={'Close'}
					closeBtnbackgroundColor={'dark'}
					style={{
						height: Platform.OS === 'android' ? '35%' : '30%',
					}}>
					<View style={styles.container}>
						<Text style={styles.versionTitle}>
							A new version is out:
						</Text>
						<Text
							style={
								styles.versionTitle
							}>{`version ${isNewVersion}`}</Text>
						<Button onPress={gotoStore} title='Download' />
					</View>
				</Modal>
			</NavigationContainer>
		</AuthContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	versionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: colors.black,
	},
});
