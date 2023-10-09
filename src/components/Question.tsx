import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Question, ShowAnswers } from '../api/questions';
import Text from './Text';
import colors from '../config/colors';
import defaultStyle from '../config/style';
import numberFormat from '../utility/numberFormat';

interface QuestionComponentProps {
	data: Question;
	handleSubmitAnswer: (id: string, index: number) => void;
	disabled: boolean;
	userAnswer?: number;
	showAnswers?: ShowAnswers;
	setOpen: (value: boolean) => void;
	isReport?: boolean;
}

const QuestionComponent = ({
	data,
	handleSubmitAnswer,
	disabled = false,
	userAnswer,
	showAnswers,
	setOpen,
	isReport,
}: QuestionComponentProps) => {
	return (
		<>
			{data && (
				<View style={styles.container}>
					{!disabled && (
						<View style={styles.ask}>
							<Text>{`${data?.createdBy?.firstName} ${data?.createdBy?.lastName} asking`}</Text>
							<Text
								style={
									styles.askText
								}>{`about ${data?.nation?.name} (${data?.nation?.flag}):`}</Text>
						</View>
					)}
					<View>
						<Text
							key={`qu-${data?.createdBy?.id}-${data?._id}`}
							style={[
								styles.questionText,
								defaultStyle.textAlignRTL,
							]}>
							{data.question}
						</Text>
					</View>
					<View style={[styles.dataContainer, defaultStyle.rtlRow]}>
						{data?.amountOfanswers?.all > 0 &&
							data?.amountOfanswers?.correct > 0 && (
								<View
									style={[
										styles.ratingContainer,
										defaultStyle.rtlRow,
									]}>
									<MaterialCommunityIcons
										name='check-decagram'
										color={colors.ok}
										size={18}
									/>
									<Text style={styles.ratingText}>
										{`${numberFormat(
											data.amountOfanswers?.correct
										)}/${numberFormat(
											data.amountOfanswers?.all
										)} correct (${(
											(data.amountOfanswers.correct /
												data.amountOfanswers.all) *
											100
										).toFixed(0)}%)`}
									</Text>
								</View>
							)}
						{data?.rating?.value && (
							<View
								style={[
									styles.ratingContainer,
									defaultStyle.rtlRow,
								]}>
								<MaterialCommunityIcons
									name='star'
									color={colors.orange}
									size={18}
								/>
								<Text style={styles.ratingText}>
									{`${data.rating.value.toFixed(
										1
									)} out of 5 (${numberFormat(
										data.rating.numberOfRatings
									)} ratings)`}
								</Text>
							</View>
						)}
					</View>

					<TouchableOpacity
						onPress={() => setOpen(true)}
						disabled={isReport}
						style={[
							styles.reportContainer,
							defaultStyle.alignSelfStartRtl,
							isReport && { opacity: 0.5 },
						]}>
						<View
							style={[
								styles.ratingContainer,
								defaultStyle.rtlRow,
							]}>
							<MaterialCommunityIcons
								name='flag-variant'
								color={colors.dark}
								size={16}
							/>
							<Text style={styles.reportText}>
								Report question
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			)}
			<FlatList
				data={data?.answers?.options}
				keyExtractor={(item, index) =>
					`an-${item}-${index}-${data?.createdBy?.id}-${data?._id}`
				}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						disabled={disabled}
						style={[
							styles.answersContainer,
							userAnswer === index &&
								styles.selectedAnswersContainer,
							showAnswers?.correctIndex === index &&
								styles.correctAnswersContainer,
							showAnswers?.userIndex !==
								showAnswers?.correctIndex &&
								showAnswers?.userIndex === index &&
								styles.wrongAnswersContainer,
						]}
						onPress={() => handleSubmitAnswer(data._id, index)}>
						<Text
							style={[
								styles.answerText,
								showAnswers?.correctIndex === index &&
									styles.correctAnswerText,
							]}>
							{item}
						</Text>
					</TouchableOpacity>
				)}
			/>
		</>
	);
};

export default QuestionComponent;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20,
		marginTop: 30,
		marginBottom: 15,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 20,
		paddingHorizontal: 20,
		paddingBottom: 10,
		backgroundColor: colors.light,
		borderRadius: 12,
	},
	ask: {
		marginBottom: 15,
		alignItems: 'center',
	},
	askText: {
		fontWeight: 'bold',
	},
	questionText: {
		fontWeight: 'bold',
		fontSize: 20,
	},
	answersContainer: {
		marginHorizontal: 20,
		marginVertical: 8,
		padding: 10,
		borderColor: colors.dark,
		borderWidth: 1,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedAnswersContainer: {
		borderWidth: 3,
		borderColor: colors.primary,
	},
	wrongAnswersContainer: {
		borderColor: colors.delete,
	},
	correctAnswersContainer: {
		backgroundColor: colors.ok,
		borderWidth: 3,
		borderColor: colors.ok,
	},
	answerText: {
		fontWeight: 'bold',
	},
	correctAnswerText: {
		color: colors.white,
	},
	dataContainer: {
		alignSelf: 'flex-start',
		width: '100%',
		marginTop: 20,
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	ratingContainer: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	reportContainer: {
		marginTop: 18,
		marginStart: -10,
	},
	ratingText: {
		paddingStart: 3,
		fontSize: 14,
	},
	reportText: {
		paddingStart: 3,
		fontSize: 12,
	},
});
