import React, { useState, useEffect } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import Activityindicator from '../components/Activityindicator';
import NoResults from '../components/NoResults';
import AddItem from '../components/addItem';
import routes from '../navigation/routes';
import CardItem from '../components/cardItem';
import showError from '../components/notifications/showError';
import askBeforeDelete from '../components/askBeforeDelete';
import showOk from '../components/notifications/showOk';
import ListItemMoreOptions from '../components/ListItemMoreOptions';
import { ApiResponse } from 'apisauce';
import questionApi, { Question } from '../api/questions';
import Text from '../components/Text';
import { useIsFocused } from '@react-navigation/native';
import useAuth from '../auth/useAuth';
import authApi from '../api/auth';

function MyQuestionsScreen({ navigation, route }) {
	const { user, logOut, setUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [data, setData] = useState<Question[]>([]);
	const isFocused = useIsFocused();

	const getMyQuestions = async () => {
		setLoading(true);
		const result: ApiResponse<any> = await questionApi.getMyQuestions();
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
			setData([]);
			getUser();
			return setError(result.data.error);
		}
		setError(undefined);
		setLoading(false);
		setData(result.data.list);
	};

	const getUser = async () => {
		const result: ApiResponse<any> = await authApi.getUser('total');
		if (
			!result.ok &&
			result.problem === 'NETWORK_ERROR' &&
			!result.status
		) {
			return setError('Network error: Unable to connect to the server');
		} else if (result.status === 401 || result.status === 403) {
			return logOut();
		} else if (result.data.error) {
			return setError(result.data.error);
		} else setError(undefined);
		setUser(result.data);
	};

	useEffect(() => {
		getMyQuestions();
	}, [navigation, isFocused]);

	const handleAddPress = () => {
		navigation.navigate(routes.QUESTION_ADD_EDIT.name, { inScreen: true });
	};
	const handleOnPress = (item) => {
		item.edit = true;
		item.inScreen = true;
		navigation.navigate(routes.QUESTION_ADD_EDIT.name, item);
	};

	const handleDeleteOnePress = async (item: Question) => {
		const answer = await askBeforeDelete(
			'Deleting a question',
			'Are you sure you want to delete the question?',
			user?.sounds
		);
		if (answer && item._id) {
			if (answer === 'pass') return;
			const result: ApiResponse<any> = await questionApi.remove(item._id);
			if (
				!result.ok &&
				result.problem === 'NETWORK_ERROR' &&
				!result.status
			)
				return showError(result.data.error, user?.sounds);
			showOk(result.data.msg, user?.sounds);
			setData(data.filter((item) => item._id !== result.data.id));
		}
	};

	return (
		<Screen>
			<Activityindicator visible={loading} />
			{data.length === 0 && !loading && (
				<NoResults
					title='No questions found'
					text='The questions you write will appear here'
					iconName='comment-question'
				/>
			)}
			<FlatList
				data={data}
				keyExtractor={(item) => item._id.toString()}
				renderItem={({ item }) => (
					<CardItem
						title={item.question}
						onPress={() => handleOnPress(item)}
						IconComponent={
							<View style={styles.flag}>
								<Text style={styles.flagText}>
									{item.nation?.flag}
								</Text>
							</View>
						}
						rating={item.rating}
						amountOfanswers={item.amountOfanswers}
						renderLeftActions={() => (
							<ListItemMoreOptions
								deleteme
								edit
								editIcon='edit'
								onPressDelete={() => handleDeleteOnePress(item)}
								onPressEdit={() => handleOnPress(item)}
							/>
						)}
					/>
				)}
			/>
			<AddItem
				iconName='plus'
				backgroundColor={colors.primary}
				onPress={handleAddPress}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	flag: {
		backgroundColor: colors.light,
		height: 40,
		width: 40,
		borderRadius: 20,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagText: {
		fontSize: Platform.OS === 'android' ? 20 : 24,
		paddingBottom: Platform.OS === 'android' ? 2 : 0,
	},
});

export default MyQuestionsScreen;
