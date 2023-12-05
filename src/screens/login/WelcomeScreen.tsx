import React, { useEffect, useState } from 'react';
import {
	ImageBackground,
	StyleSheet,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { jwtDecode } from 'jwt-decode';
import * as Yup from 'yup';
import * as Google from 'expo-auth-session/providers/google';
import * as Apple from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';

import authApi, { Nation, User } from '../../api/auth';
import {
	ErrorMessage,
	Form,
	FormField,
	FormPicker,
	FormSelectItem,
	SubmitButton,
} from '../../components/forms';
import colors from '../../config/colors';
import nationsApi from '../../api/nations';
import questionApi from '../../api/questions';
import Text from '../../components/Text';
import useAuth from '../../auth/useAuth';
import navigation from '../../navigation/rootNavigation';
import routes from '../../navigation/routes';
import Screen from '../../components/Screen';
import { ApiResponse } from 'apisauce';
import showOk from '../../components/notifications/showOk';
import Activityindicator from '../../components/Activityindicator';
import Modal from '../../components/AppModal';
import Button from '../../components/Button';
import defaultStyle from '../../config/style';
import storageAppleUser from '../../auth/storageAppleUser';

WebBrowser.maybeCompleteAuthSession();

export interface NationSelect {
	label: string;
	value: string;
	key: number | string;
}

interface InitialValues {
	firstName?: string;
	lastName?: string;
	nation?: {
		name?: string;
		flag?: string;
	};
	language?: string;
	email?: string;
	password?: string;
	terms?: boolean;
	verifiedEmail?: boolean;
}

function WelcomeScreen({ route }: any) {
	const auth = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [terms, setTerms] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [appleBtnAvailable, setAppleBtnAvailable] = useState<boolean>(false);
	const [signMode, setSignMode] = useState<string>('SignIn');
	const [nationList, setNationList] = useState<Nation[]>([]);
	const [languages, setLanguages] = useState<NationSelect[]>([]);
	const [nationSelectList, setNationSelectList] = useState<NationSelect[]>(
		[]
	);
	const [initialValues, setInitialValues] = useState<InitialValues>(
		signMode === 'SignUp'
			? {
					firstName: undefined,
					lastName: undefined,
					nation: {
						name: undefined,
						flag: undefined,
					},
					language: undefined,
					email: undefined,
					password: undefined,
					terms: false,
			  }
			: {
					email: undefined,
					password: undefined,
			  }
	);
	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId:
			'163827222600-6dps18qkcsqln8anoes7aajk16ssubs9.apps.googleusercontent.com',
		iosClientId:
			'163827222600-06eiimp7tg1inrpobnfcv7llscjf7e3t.apps.googleusercontent.com',
	});

	const validationSchema = Yup.object().shape(
		signMode === 'SignUp'
			? {
					firstName: Yup.string()
						.required()
						.label('First Name')
						.matches(
							/^[a-zA-Z ]*$/,
							'Should contain only alphabets'
						),
					lastName: Yup.string()
						.label('Last Name')
						.matches(
							/^[a-zA-Z ]*$/,
							'Should contain only alphabets'
						),
					email: Yup.string()
						.required()
						.email()
						.label('Email address'),
					password: Yup.string().required().min(6).label('Password'),
					terms: Yup.bool().oneOf(
						[true],
						'You must confirm the terms of use'
					),
			  }
			: {
					email: Yup.string()
						.required()
						.email()
						.label('Email address'),
					password: Yup.string().required().min(6).label('Password'),
			  }
	);

	const handleSubmit = async (values: InitialValues) => {
		setLoading(true);
		if (signMode === 'SignIn' && values.firstName) {
			values.firstName = undefined;
		}
		if (values.nation) {
			const tempNation = nationList?.find(
				(item) => item.name === values.nation
			);
			values.nation = tempNation;
		}
		if (values.language) {
			values.nation = {
				...values.nation,
				language: values.language,
			} as Nation;
		}
		values.email = values.email?.toLowerCase();

		const result: ApiResponse<any> | any = await authApi.loginRegister(
			values
		);
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			setLoading(false);
			return setError('Network error: Unable to connect to the server');
		} else if (result.data.error) {
			setLoading(false);
			return setError(result.data.error);
		}
		if (result.data.register) {
			showOk(result.data.message, false);
			setError(result.data.message);
			setLoading(false);
			setSignMode('SignIn');
			setInitialValues({
				email: undefined,
				password: undefined,
			});
		} else {
			setError(undefined);
			setLoading(false);
			auth.logIn(
				result.data,
				signMode === 'SignUp',
				values.verifiedEmail
			);
		}
	};

	const getNationList = async () => {
		if (nationList.length > 0) return;
		const result: ApiResponse<any> | any = nationsApi.get();

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

	const checkAppleBtnIsAvailable = async () => {
		const isAvailable = await Apple.isAvailableAsync();
		setAppleBtnAvailable(isAvailable);
	};

	const getSupportedLanguages = async () => {
		if (languages.length > 0) return;
		const result: ApiResponse<any> | any =
			await questionApi.getSupportedLanguages();
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			setLoading(false);
			return setError('Network error: Unable to connect to the server');
		} else if (result.data?.error) {
			setLoading(false);
			return setError(result.data.error);
		}

		setError(undefined);
		const tempList = result.data.list.map((item: any) => {
			return {
				label: item.name,
				value: item.code,
				key: item.code,
			};
		});

		setLanguages(tempList);
	};

	const handleUseTerms = (value: boolean) => {
		if (value) {
			setOpen(value);
			setTerms(false);
		} else {
			setTerms(value);
		}
	};
	const handleConfirmTerms = () => {
		if (error === 'You must confirm the terms of use') setError(undefined);
		setOpen(false);
		setTerms(true);
	};

	const handleGoogleSignInUP = () => {
		if (signMode === 'SignUp' && !terms)
			return setError('You must confirm the terms of use');
		setError(undefined);
		promptAsync();
	};

	const handleAppleSignInUP = async () => {
		if (signMode === 'SignUp' && !terms)
			return setError('You must confirm the terms of use');
		setLoading(true);
		try {
			const appleUser: any = await Apple.signInAsync({
				requestedScopes: [
					Apple.AppleAuthenticationScope.FULL_NAME,
					Apple.AppleAuthenticationScope.EMAIL,
				],
			});

			const decoded: any = jwtDecode(appleUser.identityToken);
			if (appleUser?.fullName?.givenName) {
				storageAppleUser.storeFullName(
					JSON.stringify(appleUser.fullName)
				);
			}
			const prevFullNameJson: any = await storageAppleUser.getFullName();
			const prevFullName = JSON.parse(prevFullNameJson);
			if (!appleUser.identityToken) {
				setLoading(false);
				return setError(
					'Apple Authorization error: Unable to get details from your Apple account. Your Identity Token is missing'
				);
			} else if (!decoded.email) {
				setLoading(false);
				return setError(
					'Apple Authorization error: Unable to get details from your Apple account. Your Email is missing'
				);
			} else if (
				signMode === 'SignUp' &&
				!appleUser?.fullName?.givenName &&
				!prevFullName.givenName
			) {
				setLoading(false);
				return setError(
					'Apple Authorization error: To sign up, you must provide a first name'
				);
			} else if (signMode === 'SignUp' && !decoded.email_verified) {
				setLoading(false);
				return setError(
					'Apple Authorization error: To sign up through Apple, you must first verify your email address in your Apple account'
				);
			}

			const firstName = appleUser?.fullName?.givenName
				? appleUser?.fullName?.givenName
				: prevFullName.givenName;
			const lastName = appleUser?.fullName?.familyName
				? appleUser?.fullName?.familyName
				: prevFullName.familyName;

			const user: InitialValues & User = {
				email: decoded.email,
				firstName: firstName,
				lastName: lastName,
				profilePic: undefined,
				verifiedEmail: decoded.email_verified || false,
				language: 'en',
			};
			handleSubmit(user);
			setError(undefined);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			if (error.code === 'ERR_REQUEST_CANCELED') {
				return setError(
					'Authorization error: Unable to connect to your Apple account'
				);
			} else {
				return setError(`Authorization error: ${error}`);
			}
		}
	};

	const handleSwitch = (value: string) => {
		setSignMode(value);
		setError(undefined);
		setTerms(false);
		setInitialValues(
			value === 'SignUp'
				? {
						firstName: undefined,
						lastName: undefined,
						nation: {
							name: undefined,
							flag: undefined,
						},
						email: undefined,
						password: undefined,
						terms: false,
				  }
				: {
						email: undefined,
						password: undefined,
				  }
		);
	};

	const handleGoogleGetUserDetails = async () => {
		if (!response) return;
		setLoading(true);
		const token = (response as any).authentication.accessToken;
		if (!token) {
			setLoading(false);
			return setError(
				'Authorization error: Unable to get your Google account token'
			);
		}
		try {
			const response = await fetch(
				'https://www.googleapis.com/userinfo/v2/me',
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setLoading(false);
			setError(undefined);
			const googleUser = await response.json();

			const user: InitialValues & User = {
				email: googleUser.email,
				firstName: googleUser.given_name,
				lastName: googleUser.family_name || '',
				profilePic: googleUser?.picture,
				verifiedEmail: googleUser.verified_email || false,
				language: googleUser.locale?.split('-')[0],
			};

			handleSubmit(user);
		} catch (error) {
			setLoading(false);
			return setError(`Authorization error: ${error}`);
		}
	};

	useEffect(() => {
		checkAppleBtnIsAvailable();
		getSupportedLanguages();
		getNationList();
	}, []);

	useEffect(() => {
		if (response) {
			if (response.type === 'cancel') {
				setLoading(false);
				setError(undefined);
			} else if (response?.type === 'success') {
				handleGoogleGetUserDetails();
			}
		}
	}, [response]);

	return (
		<ImageBackground
			style={styles.background}
			source={require('../../../assets/background.jpeg')}>
			<View style={styles.backgroundLayer}></View>
			<Screen backgroundColor={colors.opacity}>
				<Activityindicator visible={loading} />
				<ScrollView contentContainerStyle={styles.form}>
					{signMode === 'SignUp' ? (
						<Text style={styles.header}>Create Account</Text>
					) : (
						<Image
							source={require('../../../assets/AskYourNationLogo.png')}
							style={styles.logo}
						/>
					)}
					<Form
						initialValues={initialValues}
						onSubmit={handleSubmit}
						validationSchema={validationSchema}>
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
						{signMode === 'SignUp' && languages.length > 0 && (
							<FormPicker
								name='language'
								list={languages}
								fixedPadding={40}
								placeholder={{
									label: 'Select your language',
									value: null,
									color: colors.dark,
								}}
								icon='translate'
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
						{signMode === 'SignIn' ? (
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
						) : (
							<FormSelectItem
								name='terms'
								title='I agree to the Terms of Use'
								onPress={(value: boolean) =>
									handleUseTerms(value)
								}
								firstValue={terms}
							/>
						)}
						<View style={styles.separatorForm}></View>
						<ErrorMessage error={error} visible={!!error} />
						<SubmitButton
							title={
								signMode === 'SignUp' ? 'Sign Up' : 'Sign In'
							}
							backgroundColor={
								signMode === 'SignUp' ? 'primary' : 'secondary'
							}
						/>
						<View style={styles.separator}>
							<View style={styles.separatorLine}></View>
							<Text style={styles.separatorText}>or</Text>
							<View style={styles.separatorLine}></View>
						</View>
						<View
							style={[
								styles.signBtns,
								signMode === 'SignUp' &&
									appleBtnAvailable &&
									styles.signUpBtns,
							]}>
							{appleBtnAvailable && (
								<Button
									title={`Sign ${
										signMode === 'SignUp' ? 'up' : 'in'
									} ${
										signMode === 'SignUp' &&
										appleBtnAvailable
											? ''
											: 'with Apple'
									}`}
									onPress={() => handleAppleSignInUP()}
									style={[
										styles.apple,
										signMode === 'SignUp' &&
											appleBtnAvailable &&
											styles.signUpApple,
									]}
									backgroundColor='white'
									color='black'
									icon='apple'
									image='apple'
								/>
							)}
							<Button
								title={`Sign ${
									signMode === 'SignUp' ? 'up' : 'in'
								} ${
									signMode === 'SignUp' && appleBtnAvailable
										? ''
										: 'with Google'
								}`}
								onPress={() => handleGoogleSignInUP()}
								style={[
									styles.google,
									signMode === 'SignUp' &&
										appleBtnAvailable &&
										styles.signUpGoogle,
								]}
								backgroundColor='white'
								color='black'
								icon='google'
								image='google'
							/>
						</View>
					</Form>
				</ScrollView>
				<TouchableOpacity
					style={[defaultStyle.rtlRow, styles.btnSwitch]}
					onPress={() =>
						handleSwitch(
							signMode === 'SignUp' ? 'SignIn' : 'SignUp'
						)
					}>
					<Text style={{ color: colors.dark }}>
						{signMode === 'SignUp'
							? 'Already have an account?'
							: `Don't have an account?`}
					</Text>
					<Text
						style={[
							styles.signInOnText,
							{
								color:
									signMode === 'SignUp'
										? colors.secondary
										: colors.primary,
							},
						]}>
						{signMode === 'SignUp' ? 'Sign in' : 'Sign up'}
					</Text>
				</TouchableOpacity>
				<Modal
					visible={open}
					setVisible={setOpen}
					closeBtnText={'Close'}
					closeBtnbackgroundColor={'dark'}
					style={{
						height: '85%',
					}}>
					<ScrollView
						style={styles.container}
						contentContainerStyle={styles.innerContainer}>
						<Text style={styles.title}>Terms of Use ("Terms")</Text>
						<Text>Last Updated: 10/10/2023</Text>
						<Text
							style={[
								styles.textBold,
								defaultStyle.textAlignJustifyRTL,
							]}>
							Please read these Terms of Use ("Terms") carefully
							before using the "Ask Your Nation" mobile
							application (the "App") operated by Ohad Nave ("we,"
							"us," or "our").
						</Text>
						<Text
							style={[
								styles.textBold,
								defaultStyle.textAlignJustifyRTL,
							]}>
							By accessing or using the App, you agree to be bound
							by these Terms. If you do not agree to these Terms,
							please do not use the App.
						</Text>
						<Text style={styles.subTitle}>
							1. Acceptance of Terms
						</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							By accessing or using the App, you acknowledge that
							you have read, understood, and agree to be bound by
							these Terms, our Privacy Policy, and any other
							applicable policies, guidelines, or terms and
							conditions.
						</Text>
						<Text style={styles.subTitle}>2. User Content</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							2.1. Users must agree to these Terms and the
							End-User License Agreement (EULA) during the
							registration process. These terms make it clear that
							there is no tolerance for objectionable content or
							abusive users.
						</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							2.2. Users are not permitted to engage in free-form
							conversations with other users. The App is designed
							for users to write questions, and other users can
							provide answers to those questions.
						</Text>
						<Text style={styles.subTitle}>
							3. Reporting Objectionable Content
						</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							3.1. The App provides a mechanism called "report
							question" for users to flag objectionable content.
							We take user reports seriously.
						</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							3.2. Upon receiving a report, we will review the
							objectionable content within 24 hours. If the report
							is valid, we will take appropriate action, including
							removing the content and ejecting the user
							responsible for the offending content.
						</Text>
						<Text style={styles.subTitle}>
							4. User Responsibility
						</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							If a user encounters incorrect, inaccurate,
							offensive, or inappropriate content in any way, they
							are encouraged to report the question so that we can
							promptly investigate, delete it, and take action
							against the user who posted it.
						</Text>
						<Text style={styles.subTitle}>5. Termination</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							We reserve the right to terminate or suspend access
							to the App and its services for users who violate
							these Terms or engage in objectionable behavior.
						</Text>
						<Text style={styles.subTitle}>6. Modifications</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							We may update these Terms at any time, and it is the
							user's responsibility to review them periodically.
							Continued use of the App after modifications
							constitute acceptance of the revised Terms.
						</Text>
						<Text style={styles.subTitle}>7. Contact Us</Text>
						<Text
							style={[
								styles.text,
								defaultStyle.textAlignJustifyRTL,
							]}>
							If you have any questions or concerns about these
							Terms, please contact us at ohadnave@gmail.com
						</Text>
					</ScrollView>
					<Button
						onPress={handleConfirmTerms}
						style={styles.btn}
						title='Confirm the terms'
					/>
				</Modal>
			</Screen>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	form: {
		zIndex: 2,
		width: Dimensions.get('window').width,
		paddingHorizontal: 20,
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
	separatorForm: {
		height: 10,
	},
	separator: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 5,
	},
	separatorLine: {
		borderBottomWidth: 1,
		borderColor: colors.dark,
		width: '45%',
	},
	separatorText: {
		width: 40,
		textAlign: 'center',
		marginTop: -2,
	},
	logo: {
		width: 230,
		height: 230,
		marginBottom: 10,
	},
	logoSignUp: {
		width: 100,
		height: 100,
		marginBottom: 10,
	},
	container: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 20,
	},
	innerContainer: {
		paddingVertical: 20,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	header: {
		fontSize: 28,
		fontWeight: 'bold',
		color: colors.primary,
		marginTop: 5,
		marginBottom: 5,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.black,
	},
	subTitle: {
		paddingTop: 20,
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.black,
	},
	textBold: {
		paddingTop: 20,
		fontWeight: 'bold',
	},
	text: {
		paddingTop: 10,
	},
	btn: {
		marginTop: 30,
	},
	apple: {
		borderWidth: 1,
		borderColor: colors.dark,
	},
	google: {
		borderWidth: 1,
		borderColor: colors.dark,
	},
	signBtns: {
		width: '100%',
	},
	signUpBtns: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	signUpApple: {
		width: '49%',
		justifyContent: 'flex-end',
	},
	signUpGoogle: {
		width: '49%',
		justifyContent: 'flex-end',
	},
	btnSwitch: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 50,
	},
	signInOnText: {
		paddingHorizontal: 5,
		fontWeight: 'bold',
	},
});

export default WelcomeScreen;
