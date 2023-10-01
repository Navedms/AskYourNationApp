import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import NoResults from '../components/NoResults';
import Screen from '../components/Screen';
import Score from '../components/Score';
import { Filters, SortBy, User } from '../api/auth';
import { ApiResponse } from 'apisauce';
import authApi from '../api/auth';
import Activityindicator from '../components/Activityindicator';
import defaultStyle from '../config/style';
import Text from '../components/Text';
import colors from '../config/colors';
import useAuth from '../auth/useAuth';

const defaultFilters: Filters = {
	sortBy: 'answers',
	limit: 10,
};

const limitList = [10, 20, 50];

interface HighScoresScreenProps {
	navigation: any;
	sortBy: SortBy;
}

function HighScoresAnswersScreen({ navigation }: HighScoresScreenProps) {
	// state
	const isFocused = useIsFocused();
	const { logOut } = useAuth();
	const [user, setUser] = useState<User>();
	const [data, setData] = useState<User[]>([]);
	const [error, setError] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [filters, setFilters] = useState<Filters>(defaultFilters);
	const [userNotinList, setUserNotinList] = useState<boolean>(false);

	// APIs
	const getUser = async () => {
		const result: ApiResponse<any> = await authApi.getUser('answers');
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
		setUser(result.data);
	};

	const getUsers = async (limit?: number) => {
		const tempFilters = { ...filters, limit: limit || filters.limit };

		setLoading(true);
		const result: ApiResponse<any> = await authApi.getTop(tempFilters);
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
		const userInList = result.data.list.find(
			(item: User) => item.id === user?.id
		);
		setUserNotinList(user?.id ? !userInList : false);
		if (!userInList) {
			getUser();
		} else {
			setLoading(false);
		}
	};

	const handleOnPress = (limit: number) => {
		setFilters({ ...filters, limit: limit });
		getUsers(limit);
	};

	// react hooks
	useEffect(() => {
		getUsers();
	}, [navigation, isFocused]);

	// render

	return (
		<Screen style={{ paddingTop: 0 }}>
			<Activityindicator visible={loading} />
			{data.length === 0 ? (
				<NoResults
					title='No records to display'
					text='Play the game, and your record will appear here'
					iconName='medal'
				/>
			) : (
				<View style={styles.container}>
					<View style={[styles.btnsContainer, defaultStyle.rtlRow]}>
						<Text>Show top: </Text>
						{limitList.map((item: number) => (
							<TouchableOpacity
								style={[
									styles.topItem,
									item === filters.limit &&
										styles.topActiveItem,
								]}
								key={`${item}-'answers'`}
								onPress={() => handleOnPress(item)}>
								<Text
									style={[
										styles.topItemText,
										item === filters.limit &&
											styles.topActiveItemText,
									]}>{`${item}`}</Text>
							</TouchableOpacity>
						))}
					</View>
					{user && (
						<FlatList
							data={data}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item, index }) => (
								<Score
									id={item.id}
									title={`${item.firstName} ${item.lastName}`}
									score={item.points?.[filters.sortBy]}
									rank={index + 1}
									nation={item.nation}
									user={user}
								/>
							)}
						/>
					)}
					{userNotinList && user && (
						<View style={styles.me}>
							<Score
								id={user.id}
								title={`${user.firstName} ${user.lastName}`}
								score={user.points?.[filters.sortBy]}
								rank={user.rank || 0}
								nation={user.nation}
								user={user}
							/>
						</View>
					)}
				</View>
			)}
		</Screen>
	);
}

// style

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	btnsContainer: {
		padding: 15,
		backgroundColor: colors.light,
	},
	topItem: {
		paddingHorizontal: 10,
		paddingVertical: 3,
		marginHorizontal: 3,
		borderWidth: 1,
		borderRadius: 20,
		borderColor: colors.medium,
		backgroundColor: colors.white,
	},
	topActiveItem: {
		backgroundColor: colors.primary,
	},
	topItemText: {
		fontSize: 12,
	},
	topActiveItemText: {
		color: colors.white,
		fontWeight: 'bold',
	},
	me: {
		width: '100%',
		marginTop: 10,
		borderTopWidth: 1,
		borderColor: colors.medium,
		alignSelf: 'flex-end',
	},
});

export default HighScoresAnswersScreen;
