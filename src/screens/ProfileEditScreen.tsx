import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import authApi, { Nation, User } from '../api/auth';
import questionApi from '../api/questions';
import {
	ErrorMessage,
	Form,
	FormImagePicker,
	FormField,
	FormPicker,
	SubmitButton,
} from '../components/forms';
import colors from '../config/colors';
import Text from '../components/Text';
import Screen from '../components/Screen';
import Button from '../components/Button';
import showOk from '../components/notifications/showOk';
import routes from '../navigation/routes';
import defaultStyle from '../config/style';
import { NationSelect } from './login/WelcomeScreen';
import nationsApi from '../api/nations';
import { ApiResponse } from 'apisauce';
import Activityindicator from '../components/Activityindicator';
import useAuth from '../auth/useAuth';

interface InitialValues {
	firstName?: string;
	lastName?: string;
	nation?: string;
	language?: string;
	profilePic: string[];
}

const validationSchema = Yup.object().shape({
	firstName: Yup.string()
		.required()
		.label('First Name')
		.matches(/^[a-zA-Z ]*$/, 'Should contain only english alphabets'),
	lastName: Yup.string()
		.label('Last Name')
		.matches(/^[a-zA-Z ]*$/, 'Should contain only english alphabets'),
});

function ProfileEditScreen({ navigation, route }) {
	const user = route.params;
	const { logOut, setUser } = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [picChange, setPicChange] = useState<boolean>(false);
	const [nationList, setNationList] = useState<Nation[]>([]);
	const [languages, setLanguages] = useState<NationSelect[]>([]);
	const [nationSelectList, setNationSelectList] = useState<NationSelect[]>(
		[]
	);
	const [initialValues, setInitialValues] = useState<InitialValues>({
		nation: undefined,
		language: undefined,
		firstName: undefined,
		lastName: undefined,
		profilePic: [],
	});

	const handleSubmit = async (values: any) => {
		setLoading(true);
		(values as User).id = user.id;

		if (values.nation) {
			const tempNation = nationList.find(
				(item) => item.name === values.nation
			);
			(values as User).nation = tempNation;
		}
		if (values.language) {
			values.nation = {
				...values.nation,
				language: values.language,
			} as Nation;
		}
		const result: ApiResponse<any> | any = await authApi.update(
			values,
			picChange
		);
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			setLoading(false);
			return setError('Network error: Unable to connect to the server');
		} else if (result.status === 401 || result.status === 403) {
			setLoading(false);
			return logOut();
		} else if (result.data.error) {
			setLoading(false);
			return setError(result.data.error);
		}
		showOk(result.data.msg, user?.sounds);
		setLoading(false);
		setError(undefined);
		setUser({ ...user, getMoreDitails: undefined });
		return navigation.navigate(routes.PROFILE.name, {
			screen: routes.PROFILE_MAIN.name,
		});
	};

	const getNationList = async () => {
		if (nationList.length > 0) return;
		setLoading(true);
		const result: ApiResponse<any> | any = await nationsApi.get();
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
		setNationList(result.data.list);

		const tempList = result.data.list.map((item) => {
			return {
				label: `${item.name} ${item.flag}`,
				value: item.name,
				key: item.name,
			};
		});
		setNationSelectList(tempList);
		const newProfilePic: string[] = [];
		newProfilePic.push(user.profilePic);

		setInitialValues({
			nation: user.nation?.name,
			language: user.nation?.language,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePic: user?.profilePic ? newProfilePic : [],
		});
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

	useEffect(() => {
		getSupportedLanguages();
		getNationList();
	}, [user]);

	return (
		<Screen style={styles.screen}>
			<Activityindicator visible={loading} />
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
						onPress={() => {
							setUser({ ...user, getMoreDitails: undefined });
							return navigation.navigate(routes.PROFILE.name, {
								screen: routes.PROFILE_MAIN.name,
							});
						}}
					/>
				</View>
				<Text style={styles.title}>Edit Profile Details:</Text>
				<View style={styles.button}></View>
			</View>
			<View style={styles.form}>
				<Form
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}>
					<FormImagePicker
						name='profilePic'
						limit={1}
						firstValue={initialValues.profilePic}
						onChange={(name, value: string[]) => {
							setPicChange(true);
							setInitialValues({
								...initialValues,
								[name]: value,
							});
						}}
						style={styles.profilePic}
					/>
					<FormField
						name='firstName'
						placeholder='First Name'
						icon='account'
						firstValue={initialValues.firstName}
						onChangeCallBack={(name, value: string) =>
							setInitialValues({
								...initialValues,
								[name]: value,
							})
						}
					/>
					<FormField
						name='lastName'
						placeholder='Last Name'
						icon='account-group'
						firstValue={initialValues.lastName}
						onChangeCallBack={(name, value: string) =>
							setInitialValues({
								...initialValues,
								[name]: value,
							})
						}
					/>
					{nationSelectList.length > 0 && (
						<FormPicker
							name='nation'
							key={`my-nation-${initialValues.nation}`}
							list={nationSelectList}
							fixedPadding={40}
							placeholder={{
								label: 'Select your nation',
								value: null,
								color: colors.dark,
							}}
							icon='flag-variant'
							onChange={(name, value: string) =>
								setInitialValues({
									...initialValues,
									[name]: value,
								})
							}
							firstValue={
								typeof initialValues.nation === 'object' &&
								initialValues.nation !== null &&
								!Array.isArray(initialValues.nation)
									? initialValues.nation?.name
									: initialValues.nation
							}
						/>
					)}
					{languages.length > 0 && (
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
							onChange={(name, value: string) =>
								setInitialValues({
									...initialValues,
									[name]: value,
								})
							}
							firstValue={
								typeof initialValues.language === 'object' &&
								initialValues.language !== null &&
								!Array.isArray(initialValues.language)
									? initialValues.language?.name
									: initialValues.language
							}
						/>
					)}
					<View style={styles.separator}></View>
					<ErrorMessage error={error} visible={error} />
					<SubmitButton style={styles.submit} title='Update' />
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
		flex: 1,
		justifyContent: 'flex-start',
	},
	separator: {
		marginBottom: 30,
	},
	profilePic: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginBottom: 8,
	},
	buttonContainer: {
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	submit: {
		marginTop: 20,
	},
});

export default ProfileEditScreen;
