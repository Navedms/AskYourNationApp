import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import authApi, { Nation, User } from '../api/auth';
import {
	ErrorMessage,
	Form,
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
}

const validationSchema = Yup.object().shape({
	firstName: Yup.string().required().label('First Name'),
	lastName: Yup.string().required().label('Last Name'),
});

function ProfileEditScreen({ navigation, route }) {
	const user = route.params;
	const { logOut } = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [nationList, setNationList] = useState<Nation[]>([]);
	const [nationSelectList, setNationSelectList] = useState<NationSelect[]>(
		[]
	);
	const [initialValues, setInitialValues] = useState<InitialValues>({
		nation: undefined,
		firstName: undefined,
		lastName: undefined,
	});

	const handleSubmit = async (values: InitialValues) => {
		values.id = user.id;
		console.log(values.nation);

		if (values.nation) {
			const tempNation = nationList.find(
				(item) => item.name === values.nation
			);
			values.nation = tempNation;
		}

		const result: ApiResponse<any> | any = await authApi.update(
			values as User
		);
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return setError(result.data.error);
		} else if (!result.ok) {
			return setError('Network error: Unable to connect to the server');
		}
		showOk(result.data.msg, user?.sounds);
		setError(undefined);
		return navigation.navigate(routes.PROFILE.name, {
			screen: routes.PROFILE_MAIN.name,
		});
	};

	const getNationList = async () => {
		if (nationList.length > 0) return;
		setLoading(true);
		const result: ApiResponse<any> | any = await nationsApi.get();
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
		setNationList(result.data.list);

		const tempList = result.data.list.map((item) => {
			return {
				label: `${item.name} ${item.flag}`,
				value: item.name,
				key: item.name,
			};
		});
		setNationSelectList(tempList);
		setInitialValues({
			nation: user.nation?.name,
			firstName: user.firstName,
			lastName: user.lastName,
		});
	};

	useEffect(() => {
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
						onPress={() =>
							navigation.navigate(routes.PROFILE.name, {
								screen: routes.PROFILE_MAIN.name,
							})
						}
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
					{nationSelectList.length > 0 && initialValues.nation && (
						<FormPicker
							name='nation'
							key='my-nation'
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
							firstValue={initialValues.nation}
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
		paddingTop: 0,
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
