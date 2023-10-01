import { AppState, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAuth from '../auth/useAuth';
import { ApiResponse } from 'apisauce';
import { useIsFocused } from '@react-navigation/native';

import authApi from '../api/auth';
import questionApi, { Question, ShowAnswers } from '../api/questions';
import Screen from '../components/Screen';
import NoResults from '../components/NoResults';
import routes from '../navigation/routes';
import Header from '../components/Header';
import colors from '../config/colors';
import QuestionComponent from '../components/Question';
import Button from '../components/Button';
import Activityindicator from '../components/Activityindicator';
import RatingComponent from '../components/Rating';
import Sounds from '../components/notifications/Sounds';
import AppModal from '../components/AppModal';
import showOk from '../components/notifications/showOk';
import showError from '../components/notifications/showError';
import ReportComponent from '../components/Report';
import { log } from 'console';

export default function MainScreen({ navigation }: any) {
	// STATEs
	const { user, setUser, logOut } = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [rateMsg, setRateMsg] = useState<string | undefined>(undefined);
	const [answerMsg, setAnswerMsg] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<Question[]>([]);
	const [rendomIndex, setRendomIndex] = useState<number>(0);
	const [userAnswer, setUserAnswer] = useState<number | undefined>(undefined);
	const [showAnswers, setShowAnswers] = useState<ShowAnswers | undefined>(
		undefined
	);
	const [open, setOpen] = useState<boolean>(false);
	const [valueChange, setValueChange] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [rateDisabled, setRateDisabled] = useState<boolean>(false);
	const isFocused = useIsFocused();

	// APIs
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

	const getData = async () => {
		setLoading(true);
		const result: ApiResponse<any> = await questionApi.get();
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
		setData(result.data.list);
		setLoading(false);
	};

	const postAnswer = async (id: string, answerIndex: number) => {
		const result: ApiResponse<any> = await questionApi.answer({
			id,
			answerIndex,
		});
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return setError(result.data.error);
		} else if (!result.ok) {
			return setError('Network error: Unable to connect to the server');
		}

		setError(undefined);
		setShowAnswers(result.data);
		if (result.data.userAnsweredCorrect) {
			setAnswerMsg('Correct!');
			user?.sounds && Sounds.SoundCorrect();
		} else {
			user?.sounds && Sounds.SoundError();
		}
		getUser();
	};

	const postRate = async (id: string, rating: number) => {
		const result: ApiResponse<any> = await questionApi.rating({
			id,
			rating,
		});
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return setError(result.data.error);
		} else if (!result.ok) {
			return setError('Network error: Unable to connect to the server');
		}
		setError(undefined);
		setAnswerMsg(undefined);
		setRateMsg(result.data.msg);
	};

	const reportQuestion = async (id: string, reason: string, text: string) => {
		const result: ApiResponse<any> = await questionApi.report({
			id,
			reason,
			text,
		});
		if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return showError(result.data.error, user?.sounds);
		} else if (!result.ok) {
			return showError(
				'Network error: Unable to connect to the server',
				user?.sounds
			);
		}
		showOk(result.data.msg, user?.sounds);
	};

	// handle functions

	const handleSubmitAnswer = (id: string, index: number) => {
		setUserAnswer(index);
		setDisabled(true);
		postAnswer(id, index);
	};

	const handleSubmitRating = (id: string, rating: number) => {
		setRateDisabled(true);
		postRate(id, rating);
	};

	const handleSubmitReport = (id: string, reason: string, text: string) => {
		setOpen(false);
		reportQuestion(id, reason, text);
	};

	const handleSkipOrNext = () => {
		const newData = data.filter(
			(item) => item._id !== data[rendomIndex - 1]?._id
		);
		setData(newData);
		setRendomIndex(Math.floor(Math.random() * data.length) + 1);
		setDisabled(false);
		setUserAnswer(undefined);
		setShowAnswers(undefined);
		setAnswerMsg(undefined);
		setRateMsg(undefined);
		setRateDisabled(false);
	};

	// react hooks

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		if (data.length === 0) {
			getData();
		} else {
			setRendomIndex(Math.floor(Math.random() * data.length) + 1);
		}
	}, [data]);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			'change',
			(nextAppState) => {
				if (nextAppState === 'active') {
					handleSkipOrNext();
				}
			}
		);
		return () => {
			subscription.remove();
		};
	}, [navigation, isFocused]);

	// render

	return (
		<Screen titleColor={colors.primary}>
			<Activityindicator visible={loading} />
			{user && <Header user={user} />}
			{user?.points?.questions === 0 ? (
				<NoResults
					title='First things first!'
					text='Before responding to any questions, please write one question of your own.'
					iconName='chat-plus'
					button={
						<Button
							title='Add New Question'
							onPress={() =>
								navigation.navigate(
									routes.QUESTION_ADD_EDIT.name
								)
							}
						/>
					}
				/>
			) : (
				<View style={styles.container}>
					{data.length > 0 ? (
						<View style={styles.main}>
							{rendomIndex > 0 && (
								<QuestionComponent
									data={data[rendomIndex - 1]}
									handleSubmitAnswer={handleSubmitAnswer}
									disabled={disabled}
									userAnswer={userAnswer}
									showAnswers={showAnswers}
									setOpen={setOpen}
								/>
							)}
							{answerMsg && (
								<Text style={styles.answerMsg}>
									{answerMsg}
								</Text>
							)}
							{disabled && (
								<RatingComponent
									id={data[rendomIndex - 1]._id}
									handleSubmitRating={handleSubmitRating}
									disabled={rateDisabled}
									rateMsg={rateMsg}
								/>
							)}
							{error && <Text style={styles.error}>{error}</Text>}
							<Button
								title={disabled ? 'Next Question' : 'Skip'}
								icon={
									disabled
										? 'chevron-right'
										: 'chevron-double-right'
								}
								backgroundColor={
									disabled ? 'primary' : 'secondary'
								}
								style={styles.btnContainer}
								onPress={handleSkipOrNext}
							/>
						</View>
					) : (
						<NoResults
							title='No more questions...'
							text='Looks like you have answered all the questions for now...'
							iconName='comment-check'
							button={
								<Button
									title='Check for more'
									onPress={() => getData()}
								/>
							}
						/>
					)}
				</View>
			)}
			{data[rendomIndex - 1] && (
				<AppModal
					visible={open}
					setVisible={setOpen}
					onCloseModal={() => undefined}
					closeBtnText={'Close'}
					closeBtnbackgroundColor='dark'>
					<ReportComponent
						id={data[rendomIndex - 1]._id || ''}
						handleSubmitReport={handleSubmitReport}
					/>
				</AppModal>
			)}
		</Screen>
	);
}

// style

const styles = StyleSheet.create({
	container: { flex: 1 },
	main: {
		flex: 1,
	},
	btnContainer: {
		width: '90%',
		marginStart: '5%',
		marginEnd: '5%',
		marginVertical: 10,
	},
	answerMsg: {
		color: colors.ok,
		textAlign: 'center',
		fontSize: 22,
		fontWeight: 'bold',
	},
	error: {
		color: colors.delete,
		textAlign: 'center',
	},
});
