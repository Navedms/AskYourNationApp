import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Yup from 'yup';

import authApi from '../api/auth';
import Screen from '../components/Screen';
import {
	ErrorMessage,
	Form,
	FormField,
	SubmitButton,
} from '../components/forms';
import Text from '../components/Text';
import useAuth from '../auth/useAuth';
import navigation from '../navigation/rootNavigation';
import routes from '../navigation/routes';
import showOk from '../components/notifications/showOk';
import { ApiResponse } from 'apisauce';
import Button from '../components/Button';
import defaultStyle from '../config/style';

const validationSchema = Yup.object().shape({
	oldPassword: Yup.string().required().min(6).label('Old password'),
	newPassword: Yup.string()
		.required()
		.min(6)
		.label('New password')
		.notOneOf(
			[Yup.ref('oldPassword')],
			'A new password cannot be the same as the old password'
		),
	confirmPassword: Yup.string()
		.required()
		.min(6)
		.label('Confirm new password')
		.oneOf(
			[Yup.ref('newPassword')],
			'New password and Confirm new password are not match'
		),
});

function ChangePasswordScreen() {
	const { user } = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);

	const handleSubmit = async ({ oldPassword, newPassword }) => {
		if (user) {
			const result: ApiResponse<any> = await authApi.changePassword(
				user.id,
				oldPassword,
				newPassword
			);
			if (result.data.error) {
				return setError(result.data.error);
			} else if (!result.ok) {
				return setError(
					'Network error: Unable to connect to the server'
				);
			}
			setError(undefined);

			showOk(result.data.msg, user?.sounds);
			return navigation.navigate(routes.PROFILE.name, {
				screen: routes.PROFILE_MAIN.name,
			});
		}
	};

	return (
		<Screen style={styles.screen}>
			<View style={[defaultStyle.rtlRow, styles.header]}>
				<View style={styles.button}>
					<Button
						title=''
						fontWeight='normal'
						color='dark'
						iconSize={32}
						iconColor='black'
						backgroundColor='white'
						icon='chevron-left'
						onPress={() =>
							navigation.navigate(routes.PROFILE.name, {
								screen: routes.PROFILE_MAIN.name,
							})
						}
					/>
				</View>
				<Text style={styles.title}>Change Password:</Text>
				<View style={styles.button}></View>
			</View>
			<View style={styles.form}>
				<Form
					initialValues={{
						oldPassword: undefined,
						newPassword: undefined,
						confirmPassword: undefined,
					}}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}>
					<ErrorMessage error={error} visible={error} />
					<FormField
						autoCapitalize='none'
						autoCorrect={false}
						icon='lock'
						name='oldPassword'
						placeholder='Enter an old password'
						secureTextEntry
						textContentType='password'
					/>
					<FormField
						autoCapitalize='none'
						autoCorrect={false}
						icon='lock-open'
						name='newPassword'
						placeholder='Enter a new password'
						secureTextEntry
						textContentType='password'
					/>
					<FormField
						autoCapitalize='none'
						autoCorrect={false}
						icon='lock-check'
						name='confirmPassword'
						placeholder='Enter a new password again'
						secureTextEntry
						textContentType='password'
					/>
					<SubmitButton title='Update' backgroundColor='secondary' />
				</Form>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		paddingTop: 0,
	},
	title: {
		marginVertical: 30,
		fontSize: 20,
		textAlign: 'center',
	},
	header: {
		paddingRight: 10,
		paddingLeft: 10,
		width: '100%',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	button: {
		width: 60,
	},
	form: {
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 20,
		flex: 1,
	},
});

export default ChangePasswordScreen;
