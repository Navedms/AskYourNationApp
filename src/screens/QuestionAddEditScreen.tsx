import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Yup from 'yup';

import showOk from '../components/notifications/showOk';
import {
	ErrorMessage,
	Form,
	FormField,
	FormPicker,
	FormListMaker,
	SubmitButton,
} from '../components/forms';
import Screen from '../components/Screen';
import Text from '../components/Text';
import Button from '../components/Button';
import defaultStyle from '../config/style';
import colors from '../config/colors';
import routes from '../navigation/routes';
import askBeforeDelete from '../components/askBeforeDelete';
import { Nation } from '../api/auth';
import questionApi from '../api/questions';
import { ApiResponse } from 'apisauce';
import nationsApi from '../api/nations';
import { Item } from '../components/forms/FormListMaker';
import Activityindicator from '../components/Activityindicator';
import useAuth from '../auth/useAuth';
import authApi from '../api/auth';
import IconTextBox from '../components/IconTextBox';

interface InitialValues {
	nation?: string;
	question?: string;
	answersOptions?: Item[];
	answersCorrectIndex?: number;
}

interface NationSelect {
	label: string;
	value: string;
	key: number | string;
}

interface SendQuestion {
	answersCorrectIndex: number;
	answersOptions: Item[];
	nation: string;
	question: string;
}

const defaultValues: InitialValues = {
	nation: undefined,
	question: undefined,
	answersOptions: [],
	answersCorrectIndex: undefined,
};

const validationSchema = Yup.object().shape({
	nation: Yup.string().required().label('Nation'),
	question: Yup.string().required().min(40).max(200).label('Question'),
	answersOptions: Yup.array()
		.required()
		.min(4)
		.max(4)
		.label('Answers')
		.of(
			Yup.object().shape({
				value: Yup.string().required().label('Answer').max(40).trim(),
			})
		),
	answersCorrectIndex: Yup.number()
		.label('Correct Answer')
		.required()
		.positive()
		.integer()
		.min(0)
		.max(3),
});

function QuestionAddEditScreen({ navigation, route }: any) {
	const item = route.params || {};

	//state
	const { setUser, user, logOut } = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [resetFields, setResetFields] = useState<boolean>(false);
	const [nationList, setNationList] = useState<Nation[]>([]);
	const [initialValues, setInitialValues] =
		useState<InitialValues>(defaultValues);
	const [nationSelectList, setNationSelectList] = useState<NationSelect[]>(
		[]
	);

	// handle and APIs functions

	const handleSubmit = async (values: SendQuestion) => {
		setLoading(true);
		const newQuestion: any = {};

		newQuestion.question = values.question;

		if (values.answersOptions) {
			const tempAnswers = values.answersOptions.map((item) => item.value);
			newQuestion.answers = {};
			newQuestion.answers.options = tempAnswers;
			newQuestion.answers.correctIndex = values.answersCorrectIndex;
		}

		if (values.nation) {
			const tempNation = nationList.find(
				(item) => item.name === values.nation
			);
			newQuestion.nation = tempNation;
		}

		if (item.edit) {
			newQuestion.id = item._id;
		}

		const result: ApiResponse<any> = item.edit
			? await questionApi.update(newQuestion)
			: await questionApi.post(newQuestion);
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			setLoading(false);

			return setError(result.data.error);
		} else if (!result.ok) {
			setLoading(false);
			return setError('Network error: Unable to connect to the server');
		}
		setError(undefined);
		setLoading(false);
		showOk(result.data.msg, user?.sounds);
		setResetFields(!resetFields);
		setInitialValues(defaultValues);
		getUser();
		return item.inScreen
			? navigation.navigate(routes.MY_QUESTIONS_MAIN.name)
			: navigation.navigate(routes.PERSONAL.name, {
					screen: routes.MY_QUESTIONS.name,
			  });
	};

	const handleDeleteOnePress = async () => {
		const answer = await askBeforeDelete(
			'Deleting a question',
			'Are you sure you want to delete the question?',
			user?.sounds
		);
		if (answer) {
			if (answer === 'pass') return;
			const result: ApiResponse<any> = await questionApi.remove(item._id);
			if (result.status === 401 || result.status === 403) {
				return logOut();
			} else if (!result.ok) return setError(result.data.error);
			setError(undefined);
			showOk(result.data.msg, user?.sounds);
			return item.inScreen
				? navigation.navigate(routes.MY_QUESTIONS_MAIN.name)
				: navigation.navigate(routes.PERSONAL.name, {
						screen: routes.MY_QUESTIONS.name,
				  });
		}
	};
	const getUser = async () => {
		const result: ApiResponse<any> = await authApi.getUser('total');
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return setError(result.data.error);
		} else if (!result.ok) {
			return setError('Network error: Unable to connect to the server');
		}

		setError(undefined);
		setUser(result.data);
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

		setError(undefined);
		setLoading(false);
		setNationList(result.data.list);

		const tempList = result.data.list.map((item) => {
			return {
				label: `${item.name} ${item.flag}`,
				value: item.name,
				key: item.name,
			};
		});
		setNationSelectList(tempList);
		if (item.edit) {
			const editValues = {
				nation: item.nation.name,
				question: item.question,
				answersOptions: item.answers.options.map(
					(element: string, index: number) => {
						return {
							id: `option-${index + 1}`,
							value: element,
						};
					}
				),
				answersCorrectIndex: item.answers.correctIndex,
			};

			setInitialValues(editValues);
		}
	};

	useEffect(() => {
		getNationList();
	}, []);

	// render

	return (
		<Screen>
			<Activityindicator visible={loading} />
			<View style={styles.container}>
				<View style={[defaultStyle.rtlRow, styles.header]}>
					<View style={styles.button}>
						<Button
							title=''
							fontWeight='normal'
							color='dark'
							iconSize={28}
							iconColor='black'
							backgroundColor='white'
							icon='close'
							onPress={() =>
								item.inScreen
									? navigation.navigate(
											routes.MY_QUESTIONS_MAIN.name
									  )
									: navigation.navigate(
											routes.PERSONAL.name,
											{
												screen: routes.MY_QUESTIONS
													.name,
											}
									  )
							}
						/>
					</View>
					<Text style={{ fontWeight: 'bold' }}>
						{item.edit
							? routes.QUESTION_ADD_EDIT.editTitle
							: routes.QUESTION_ADD_EDIT.title}
					</Text>
					<View style={styles.button}></View>
				</View>
			</View>
			<ScrollView contentContainerStyle={styles.form}>
				<Form
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={validationSchema}>
					<IconTextBox
						text='Please use only English to complete the form.'
						styleContainer={{ marginBottom: 10 }}
					/>
					{nationSelectList.length > 0 &&
						((item?.edit && initialValues.nation) ||
							!item?.edit) && (
							<FormPicker
								key={`nation-${resetFields}`}
								name='nation'
								firstValue={initialValues.nation}
								list={nationSelectList}
								fixedPadding={40}
								placeholder={{
									label: 'Select nation',
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
							/>
						)}
					<FormField
						icon='chat-question'
						key={`question-${resetFields}`}
						name='question'
						placeholder='Write a new question...'
						firstValue={initialValues.question}
						maxLength={200}
						multiline
						onChangeCallBack={(name, value: string) =>
							setInitialValues({
								...initialValues,
								[name]: value,
							})
						}
					/>
					<FormListMaker
						key={`answersOptions-${resetFields}`}
						resetFields={resetFields}
						icon='view-sequential'
						name='answersOptions'
						selectName='answersCorrectIndex'
						placeholder='Add 4 answers and select the correct one:'
						onChange={(name, value: Item[] | null) =>
							setInitialValues({
								...initialValues,
								[name]: value || [],
							})
						}
						maxLength={40}
						onPress={(name, value: number) =>
							setInitialValues({
								...initialValues,
								[name]: value,
							})
						}
						firstValue={initialValues.answersOptions}
						firstSelectValue={initialValues.answersCorrectIndex}
					/>
					<View style={styles.separator}></View>
					<ErrorMessage error={error} visible={error} />
					<SubmitButton
						style={[
							styles.submit,
							item.edit && { backgroundColor: colors.secondary },
						]}
						title={item.edit ? 'Update' : 'Post'}
					/>
				</Form>
				<View style={styles.buttonContainer}>
					{item.edit && (
						<Button
							title='Delete'
							backgroundColor='delete'
							color='white'
							onPress={handleDeleteOnePress}
						/>
					)}
				</View>
			</ScrollView>
		</Screen>
	);
}

// style

const styles = StyleSheet.create({
	form: {
		width: '100%',
		paddingHorizontal: 20,
		justifyContent: 'flex-start',
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
	submit: {
		backgroundColor: colors.primary,
	},
	title: {
		paddingHorizontal: 20,
	},
	buttonContainer: {
		paddingBottom: 10,
	},
	separator: {
		height: 20,
	},
});

export default QuestionAddEditScreen;
