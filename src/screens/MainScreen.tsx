import {
	AppState,
	Platform,
	StyleSheet,
	Text,
	View,
	StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import useAuth from '../auth/useAuth';
import { ApiResponse } from 'apisauce';
import { useIsFocused } from '@react-navigation/native';

import authApi from '../api/auth';
import questionApi, { Answers, Question, ShowAnswers } from '../api/questions';
import Screen from '../components/Screen';
import NoResults from '../components/NoResults';
import routes from '../navigation/routes';
import Header from '../components/Header';
import colors from '../config/colors';
import QuestionComponent, { TranslateQuestion } from '../components/Question';
import Button from '../components/Button';
import Activityindicator from '../components/Activityindicator';
import RatingComponent from '../components/Rating';
import Sounds from '../components/notifications/Sounds';
import AppModal from '../components/AppModal';
import showOk from '../components/notifications/showOk';
import showError from '../components/notifications/showError';
import ReportComponent from '../components/Report';
import * as Speech from 'expo-speech';

export default function MainScreen({ navigation }: any) {
	// STATEs
	const { user, setUser, logOut } = useAuth();
	const [error, setError] = useState<string | undefined>(undefined);
	const [networkError, setNetworkError] = useState<boolean>(false);
	const [answerMsg, setAnswerMsg] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<Question[]>([]);
	const [rendomIndex, setRendomIndex] = useState<number>(0);
	const [userAnswer, setUserAnswer] = useState<number | undefined>(undefined);
	const [showAnswers, setShowAnswers] = useState<ShowAnswers | undefined>(
		undefined
	);
	const [open, setOpen] = useState<boolean>(false);
	const [report, setReport] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [skipDisabled, setSkipDisabled] = useState<boolean>(false);
	const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
	const [isTranslate, setIsTranslate] = useState<boolean>(false);
	const [translate, setTranslate] = useState<TranslateQuestion>();
	const [userRate, setUserRate] = useState<number>(0);

	const isFocused = useIsFocused();

	// APIs
	const getUser = async () => {
		const result: ApiResponse<any> = await authApi.getUser('total');
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			setLoading(false);
			setNetworkError(true);
			return setError('Network error: Unable to connect to the server');
		} else if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return setError(result.data.error);
		}
		setError(undefined);
		setNetworkError(false);
		setUser({ ...result.data, getMoreDitails: user?.getMoreDitails });
		if (user?.getMoreDitails) {
			navigation.navigate(routes.PROFILE.name);
		}
	};

	const getData = async () => {
		setLoading(true);
		const result: ApiResponse<any> = await questionApi.get();
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			setLoading(false);
			setNetworkError(true);
			return setError('Network error: Unable to connect to the server');
		} else if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			setLoading(false);
			return setError(result.data.error);
		}

		setError(undefined);
		setNetworkError(false);
		if (result.data.list?.length === 1) {
			setSkipDisabled(true);
		} else {
			setSkipDisabled(false);
		}
		setData(result.data.list);
		setLoading(false);
	};

	const postAnswer = async (
		id: string,
		answerIndex: number,
		rank: number
	) => {
		const result: ApiResponse<any> = await questionApi.answer({
			id,
			answerIndex,
			rank,
		});
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
			return setError(result.data.error);
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
			return setError(result.data.error);
		}
		setUserRate(0);
		setError(undefined);
	};

	const reportQuestion = async (
		id: string,
		reason: string,
		text: string,
		blockUser: boolean
	) => {
		const result: ApiResponse<any> = await questionApi.report({
			id,
			reason,
			text,
			blockUser,
		});
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			return showError(
				'Network error: Unable to connect to the server',
				user?.sounds
			);
		} else if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return showError(result.data.error, user?.sounds);
		}
		setReport(true);
		showOk(result.data.msg, user?.sounds);
	};

	const translateQuestion = async (text: string) => {
		const result: ApiResponse<any> = await questionApi.translate({ text });
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			return showError(
				'Network error: Unable to connect to the server',
				user?.sounds
			);
		} else if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return showError(result.data.error, user?.sounds);
		}
		setTranslate({
			question: result.data.translate.split('|')[0],
			answers: {
				options: [
					result.data.translate.split('|')[1],
					result.data.translate.split('|')[2],
					result.data.translate.split('|')[3],
					result.data.translate.split('|')[4],
				],
			},
		});
	};

	// handle functions

	const handleSubmitAnswer = (id: string, index: number, rank: number) => {
		isSpeaking && Speech.stop();
		setUserAnswer(index);
		setDisabled(true);
		postAnswer(id, index, rank);
	};

	const handleSubmitReport = (
		id: string,
		reason: string,
		text: string,
		blockUser: boolean
	) => {
		setOpen(false);
		reportQuestion(id, reason, text, blockUser);
	};

	const handleSkipOrNext = () => {
		const newData = data.filter(
			(item) => item._id !== data[rendomIndex - 1]?._id
		);
		isSpeaking && Speech.stop();
		if (report) {
			setData([]);
		} else {
			setData(newData);
		}
		if (data[rendomIndex - 1]?._id && userRate) {
			postRate(data[rendomIndex - 1]._id as string, userRate);
		}
		setRendomIndex(Math.floor(Math.random() * data.length) + 1);
		setDisabled(false);
		setUserAnswer(undefined);
		setShowAnswers(undefined);
		setAnswerMsg(undefined);
		setReport(false);
		setTranslate(undefined);
		setIsTranslate(false);
	};

	const handleTextToSpeech = (question: string, answers: Answers) => {
		if (loading) return;
		if (isSpeaking) {
			Speech.stop();
		} else {
			setLoading(true);
			const msg = `${question}. A. ${answers.options[0]}. B. ${answers.options[1]}. C. ${answers.options[2]}. or D. ${answers.options[3]}.`;
			Speech.speak(msg, {
				rate: 1.0,
				voice:
					Platform.OS === 'android'
						? 'en-us-x-tpf-local'
						: 'com.apple.ttsbundle.Samantha-compact',
				onStart: () => {
					setIsSpeaking(true);
					setLoading(false);
				},
				onDone: () => setIsSpeaking(false),
				onStopped: () => setIsSpeaking(false),
			});
		}
	};
	const handleTranslate = (question: string, answers: Answers) => {
		setIsTranslate(!isTranslate);
		if (!isTranslate && !translate) {
			const text = `${question}|${answers.options[0]}|${answers.options[1]}|${answers.options[2]}|${answers.options[3]}`;
			translateQuestion(text);
		}
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
		if (isFocused) {
			StatusBar.setBarStyle('light-content');
		} else {
			StatusBar.setBarStyle('dark-content');
		}
		isSpeaking && Speech.stop();
		const subscription = AppState.addEventListener(
			'change',
			(nextAppState) => {
				if (nextAppState === 'active') {
					setReport(true);
					handleSkipOrNext();
				}
			}
		);
		return () => {
			subscription.remove();
			StatusBar.setBarStyle('dark-content');
		};
	}, [navigation, isFocused]);

	// render

	return (
		<Screen
			titleColor={
				user?.rank && !networkError ? colors.primary : colors.white
			}>
			{user?.rank && !networkError && <Header user={user} />}
			<Activityindicator visible={loading} />
			{user?.points?.questions === 0 ? (
				<NoResults
					title='First things first!'
					text='Before responding to any questions, please write one question of your own.'
					iconName='chat-plus'
					button={
						<Button
							title='Add New Question'
							onPress={() =>
								navigation.navigate(routes.QUESTION_ADD.name)
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
									handleTextToSpeech={handleTextToSpeech}
									disabled={disabled}
									isSpeaking={isSpeaking}
									translate={translate}
									isTranslate={isTranslate}
									handleTranslate={handleTranslate}
									userAnswer={userAnswer}
									showAnswers={showAnswers}
									setOpen={setOpen}
									isReport={report}
									user={user}
									loading={loading}
								/>
							)}
							{answerMsg && (
								<Text style={styles.answerMsg}>
									{answerMsg}
								</Text>
							)}
							{disabled && (
								<RatingComponent
									userRate={userRate}
									setUserRate={setUserRate}
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
								disabled={skipDisabled && !disabled}
							/>
						</View>
					) : (
						!loading && (
							<NoResults
								title={
									networkError
										? error
										: 'No more questions...'
								}
								text={
									networkError
										? 'Please try again later...'
										: 'Looks like you have answered all the questions for now...'
								}
								iconName={
									networkError ? 'wifi-off' : 'comment-check'
								}
								button={
									networkError ? undefined : (
										<Button
											title='Check for more'
											onPress={() => getData()}
										/>
									)
								}
							/>
						)
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
