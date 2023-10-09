import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Yup from 'yup';

import authApi, { ForgotPassword } from '../../api/auth';
import Screen from '../../components/Screen';
import {
	ErrorMessage,
	Form,
	FormField,
	SubmitButton,
} from '../../components/forms';
import Text from '../../components/Text';
import navigation from '../../navigation/rootNavigation';
import routes from '../../navigation/routes';
import showOk from '../../components/notifications/showOk';
import { ApiResponse } from 'apisauce';
import Activityindicator from '../../components/Activityindicator';

function ResetPasswordScreen() {
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [stage, setStage] = useState<number>(1);
	const [userId, setUserId] = useState<string>();

	const handleSubmit = async (values: ForgotPassword) => {
		setLoading(true);
		values.email = values.email?.toLowerCase();
		if (stage === 3) {
			values.id = userId;
		}
		const result: ApiResponse<any> | any =
			stage === 1
				? await authApi.resetPassword(values.email)
				: stage === 2
				? await authApi.enterVerificationCode(values)
				: await authApi.changePasswordAfterReset(values);
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
		if (stage === 2) {
			setUserId(result.data.id);
		}
		setError(undefined);
		setLoading(false);
		showOk(result.data.message, false);
		if (stage === 3 && result.data.success)
			return navigation.navigate(routes.WELCOME.name);
		setStage(stage + 1);
	};
	const dinamicValidationSchema = () => {
		const dinamicValidObject: any = {};
		dinamicValidObject.email = Yup.string()
			.required()
			.email()
			.label('Email address');
		if (stage === 2) {
			dinamicValidObject.verificationCode = Yup.number()
				.required()
				.label('Verification Code');
		}
		if (stage === 3) {
			dinamicValidObject.newPassword = Yup.string()
				.required()
				.min(6)
				.label('New Password');
		}
		return dinamicValidObject;
	};

	const validationSchema = Yup.object().shape(dinamicValidationSchema());

	return (
		<Screen style={styles.screen}>
			<Activityindicator visible={loading} />
			<Text style={styles.title}>{`Stage ${stage}: ${
				stage === 1
					? 'Send verification mail'
					: stage === 2
					? 'Enter verification code'
					: 'Set new Password'
			}`}</Text>
			<View style={styles.form}>
				<Form
					initialValues={{
						email: undefined,
						newPassword: undefined,
						verificationCode: undefined,
					}}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}>
					<FormField
						autoCorrect={false}
						autoCapitalize='none'
						icon='email'
						keyboardType='email-address'
						name='email'
						placeholder='Enter your email address'
						textContentType='emailAddress'
						disabled={stage > 1}
					/>
					{stage === 2 && (
						<FormField
							autoCorrect={false}
							icon='lock-clock'
							name='verificationCode'
							placeholder='Enter verification code'
							secureTextEntry
							textContentType='password'
						/>
					)}
					{stage === 3 && (
						<FormField
							autoCorrect={false}
							icon='lock'
							name='newPassword'
							placeholder='Enter new password'
							secureTextEntry
							textContentType='password'
						/>
					)}
					<View style={styles.separator}></View>
					<ErrorMessage error={error} visible={!!error} />
					<SubmitButton
						title={
							stage === 1
								? 'Send verification mail'
								: stage === 2
								? 'Enter verification code'
								: 'Set new Password'
						}
						backgroundColor='primary'
					/>
				</Form>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	title: {
		marginVertical: 30,
		fontSize: 18,
		textAlign: 'center',
	},
	separator: {
		height: 20,
	},
	form: {
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 20,
		flex: 1,
	},
});

export default ResetPasswordScreen;
