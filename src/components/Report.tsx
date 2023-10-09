import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import * as Yup from 'yup';

import colors from '../config/colors';
import Text from './Text';
import { Form, FormField, FormPicker, SubmitButton } from './forms';

interface ReportComponentProps {
	id: string;
	handleSubmitReport: (id: string, reason: string, text: string) => void;
}

interface InitialValues {
	reason: string;
	text: string;
}

const defaultValues: InitialValues = {
	reason: '',
	text: '',
};

const validationSchema = Yup.object().shape({
	reason: Yup.string().required().label('Reason'),
});

const reasonList = [
	{
		label: 'Not clear',
		value: 'NotClear',
		key: 'NotClear',
	},
	{
		label: 'Not in English',
		value: 'NotInEnglish',
		key: 'NotInEnglish',
	},
	{
		label: 'Wrong answer',
		value: 'WrongAnswer',
		key: 'WrongAnswer',
	},
	{
		label: 'Too hard',
		value: 'TooHard',
		key: 'TooHard',
	},
	{
		label: 'Harassment',
		value: 'Harassment',
		key: 'Harassment',
	},
	{
		label: 'Fraud or scam',
		value: 'FraudOrScam',
		key: 'FraudOrScam',
	},
	{
		label: 'Spam',
		value: 'Spam',
		key: 'Spam',
	},
	{
		label: 'Misinformation',
		value: 'Misinformation',
		key: 'Misinformation',
	},
	{
		label: 'Hateful speech',
		value: 'HatefulSpeech',
		key: 'HatefulSpeech',
	},
	{
		label: 'Threats or violence',
		value: 'ThreatsOrViolence',
		key: 'ThreatsOrViolence',
	},
	{
		label: 'Self-harm',
		value: 'SelfHarm',
		key: 'SelfHarm',
	},
	{
		label: 'Graphic content',
		value: 'GraphicContent',
		key: 'GraphicContent',
	},
	{
		label: 'Dangerous or extremist organizations',
		value: 'DangerousOrExtremistOrganizations',
		key: 'DangerousOrExtremistOrganizations',
	},
	{
		label: 'Sexual content',
		value: 'SexualContent',
		key: 'SexualContent',
	},
	{
		label: 'Other...',
		value: 'Other',
		key: 'Other',
	},
];

const ReportComponent = ({ id, handleSubmitReport }: ReportComponentProps) => {
	const [initialValues, setInitialValues] =
		useState<InitialValues>(defaultValues);

	const handleSubmit = async (values: InitialValues) => {
		handleSubmitReport(id, values.reason, values.text);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Report this question:</Text>
			<Form
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}>
				<FormPicker
					key='reason'
					name='reason'
					firstValue={initialValues.reason}
					list={reasonList}
					fixedPadding={90}
					placeholder={{
						label: 'Select Reason',
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
				<FormField
					icon='card-text'
					key='text'
					name='text'
					placeholder='Add a description in your own words...'
					firstValue={initialValues.text}
					maxLength={400}
					multiline
					onChangeCallBack={(name, value: string) =>
						setInitialValues({
							...initialValues,
							[name]: value,
						})
					}
				/>
				<View style={styles.separator}></View>
				<SubmitButton style={[styles.submit]} title='Submit' />
			</Form>
		</View>
	);
};

export default ReportComponent;

const styles = StyleSheet.create({
	container: {
		margin: 10,
		justifyContent: 'flex-start',
		alignItems: 'center',
		flex: 1,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 18,
		marginTop: 10,
		marginBottom: 20,
	},
	separator: {
		height: 20,
	},
	submit: {
		backgroundColor: colors.primary,
	},
});
