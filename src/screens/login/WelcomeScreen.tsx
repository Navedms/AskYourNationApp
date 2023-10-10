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
	FormSelectItem,
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
import Activityindicator from '../../components/Activityindicator';
import Modal from '../../components/AppModal';
import Button from '../../components/Button';
import defaultStyle from '../../config/style';

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
	const [loading, setLoading] = useState<boolean>(false);
	const [terms, setTerms] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [signMode, setSignMode] = useState<string>('SignUp');
	const [nationList, setNationList] = useState<Nation[]>([]);
	const [nationSelectList, setNationSelectList] = useState<NationSelect[]>(
		[]
	);
	const [initialValues, setInitialValues] = useState(
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
					terms: false,
			  }
			: {
					email: undefined,
					password: undefined,
			  }
	);

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
						.required()
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

	const handleSubmit = async (values: User) => {
		setLoading(true);
		if (values.nation) {
			const tempNation = nationList?.find(
				(item) => item.name === values.nation
			);
			values.nation = tempNation;
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
			auth.logIn(result.data);
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

	const handleUseTerms = (value: boolean) => {
		if (value) {
			setOpen(value);
			setTerms(false);
		} else {
			setTerms(value);
		}
	};
	const handleConfirmTerms = () => {
		setOpen(false);
		setTerms(true);
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
				<Activityindicator visible={loading} />
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
							onChange={(name: string, value: string) => {
								setSignMode(value);
								setError(undefined);
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
							}}
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
						<Button
							onPress={handleConfirmTerms}
							style={styles.btn}
							title='Confirm the terms'
						/>
					</ScrollView>
				</Modal>
			</Screen>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	form: {
		zIndex: 2,
		width: '100%',
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
	separator: {
		flex: 1,
		height: 20,
	},
	logo: {
		width: 230,
		height: 230,
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
});

export default WelcomeScreen;
