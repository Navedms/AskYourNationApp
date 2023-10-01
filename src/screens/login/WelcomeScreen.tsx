import React, { useEffect, useState } from 'react';
import {
	ImageBackground,
	StyleSheet,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import * as Yup from 'yup';

import authApi, { Nation, User } from '../../api/auth';
import {
	ErrorMessage,
	Form,
	FormField,
	FormGroupPicker,
	FormPicker,
	SubmitButton,
} from '../../components/forms';
import colors from '../../config/colors';
import nationsApi from '../../api/nations';
import Text from '../../components/Text';
import useAuth from '../../auth/useAuth';
import navigation from '../../navigation/rootNavigation';
import routes from '../../navigation/routes';
import Screen from '../../components/Screen';
import { ApiResponse } from 'apisauce';
import showOk from '../../components/notifications/showOk';

export interface NationSelect {
	label: string;
	value: string;
	key: number | string;
}

const signList = [
	{
		id: 'SignUp',
		value: 'Sign Up',
	},
	{
		id: 'SignIn',
		value: 'Sign In',
	},
];

function WelcomeScreen({ route }: any) {
	const auth = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [signMode, setSignMode] = useState<string>('SignUp');
	const [nationList, setNationList] = useState<Nation[]>([]);
	const [nationSelectList, setNationSelectList] = useState<NationSelect[]>(
		[]
	);
	const [initialValues, setInitialValues] = useState<User>(
		signMode === 'SignUp'
			? {
					firstName: undefined,
					lastName: undefined,
					nation: {
						name: undefined,
						flag: undefined,
					},
					email: undefined,
					password: undefined,
			  }
			: {
					email: undefined,
					password: undefined,
			  }
	);

	const validationSchema = Yup.object().shape(
		signMode === 'SignUp'
			? {
					firstName: Yup.string().required().label('First Name'),
					lastName: Yup.string().required().label('Last Name'),
					email: Yup.string()
						.required()
						.email()
						.label('Email address'),
					password: Yup.string().required().min(6).label('Password'),
			  }
			: {
					email: Yup.string()
						.required()
						.email()
						.label('Email address'),
					password: Yup.string().required().min(6).label('Password'),
			  }
	);

	const handleSubmit = async (values: User) => {
		if (values.nation) {
			const tempNation = nationList.find(
				(item) => item.name === values.nation
			);
			values.nation = tempNation;
		}
		values.email = values.email?.toLowerCase();

		const result: ApiResponse<any> | any = await authApi.loginRegister(
			values
		);
		if (result.data.error) {
			return setError(result.data.error);
		} else if (!result.ok) {
			return setError('Network error: Unable to connect to the server');
		}
		if (result.data.register) {
			showOk(result.data.message, false);
			setError(result.data.message);
			setSignMode('SignIn');
		} else {
			setError(undefined);
			auth.logIn(result.data);
		}
	};

	const getNationList = async () => {
		if (nationList.length > 0) return;
		const result: ApiResponse<any> | any = await nationsApi.get();

		if (result.data.error) {
			return setError(result.data.error);
		} else if (!result.ok) {
			return setError('Network error: Unable to connect to the server');
		}

		setError(undefined);
		setNationList(result.data.list);

		const tempList = result.data.list.map((item) => {
			return {
				label: `${item.name} ${item.flag}`,
				value: item.name,
				key: item.flag,
			};
		});

		setNationSelectList(tempList);
	};

	useEffect(() => {
		getNationList();
	}, []);

	return (
		<ImageBackground
			style={styles.background}
			source={require('../../../assets/background.jpeg')}>
			<View style={styles.backgroundLayer}></View>
			<Screen backgroundColor={colors.opacity}>
				<ScrollView contentContainerStyle={styles.form}>
					<Image
						source={require('../../../assets/AskYourNationLogo.png')}
						style={styles.logo}
					/>
					<Form
						initialValues={initialValues}
						onSubmit={handleSubmit}
						validationSchema={validationSchema}>
						<FormGroupPicker
							firstValue={signMode}
							key='SignInOrUp'
							name='SignInOrUp'
							list={signList}
							fixedPadding={40}
							onChange={(name: string, value: string) =>
								setSignMode(value)
							}
						/>
						{signMode === 'SignUp' && (
							<FormField
								name='firstName'
								placeholder='First Name'
								icon='account'
							/>
						)}
						{signMode === 'SignUp' && (
							<FormField
								name='lastName'
								placeholder='Last Name'
								icon='account-group'
							/>
						)}
						{signMode === 'SignUp' &&
							nationSelectList.length > 0 && (
								<FormPicker
									name='nation'
									list={nationSelectList}
									fixedPadding={40}
									placeholder={{
										label: 'Select your nation',
										value: null,
										color: colors.dark,
									}}
									icon='flag-variant'
								/>
							)}
						<FormField
							autoCorrect={false}
							autoCapitalize='none'
							icon='email'
							keyboardType='email-address'
							name='email'
							placeholder='Enter your email address'
							textContentType='emailAddress'
						/>
						<FormField
							autoCorrect={false}
							icon='lock'
							name='password'
							placeholder='Enter a password'
							secureTextEntry
							textContentType='password'
						/>
						{signMode === 'SignIn' && (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate(
										routes.FORGOT_PASSWORD.name
									)
								}>
								<Text style={{ color: colors.dark }}>
									Forgot password?
								</Text>
							</TouchableOpacity>
						)}
						<View style={styles.separator}></View>
						<ErrorMessage error={error} visible={!!error} />
						<SubmitButton
							title={
								signMode === 'SignUp' ? 'Sign Up' : 'Sign In'
							}
							backgroundColor={
								signMode === 'SignUp' ? 'primary' : 'secondary'
							}
						/>
					</Form>
				</ScrollView>
			</Screen>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	form: {
		zIndex: 2,
		width: '100%',
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	background: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		zIndex: -1,
		height: '110%',
	},
	backgroundLayer: {
		flex: 1,
		position: 'absolute',
		left: 0,
		top: 0,
		backgroundColor: colors.opacityWhite,
		height: '100%',
		zIndex: 0,
		width: '100%',
	},
	formSwitch: {
		borderWidth: 1,
	},
	separator: {
		flex: 1,
		height: 20,
	},
	logo: {
		width: 230,
		height: 230,
	},
});

export default WelcomeScreen;
