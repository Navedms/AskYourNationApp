import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import colors from '../config/colors';
import { FontAwesome5 } from '@expo/vector-icons';

import Text from './Text';
import numberFormat from '../utility/numberFormat';
import { Nation, User } from '../api/auth';
import defaultStyle from '../config/style';

interface ScoreProps {
	id: string;
	title: string;
	score?: number;
	rank: number;
	nation?: Nation;
	user: User | null;
}

function Score({ id, title, score, nation, rank, user }: ScoreProps) {
	return (
		<View
			style={[
				styles.container,
				defaultStyle.rtlRow,
				id === user.id && {
					backgroundColor: colors.secondaryBackground,
				},
			]}>
			<Text
				style={[
					styles.rank,
					defaultStyle.marginStartRtl(10),
					rank.toString().length === 2 &&
						defaultStyle.marginStartRtl(-8),
				]}>
				{rank.toString()}
			</Text>
			{nation?.flag && (
				<View style={[styles.flag, defaultStyle.marginEndRtl(8)]}>
					<Text style={styles.flagText}>{nation.flag}</Text>
				</View>
			)}
			<View>
				<Text style={styles.title}>{title}</Text>
				{nation?.name && (
					<Text style={styles.nation}>{nation?.name}</Text>
				)}
			</View>
			<View style={[styles.scoreContainer, defaultStyle.rtlRow]}>
				{rank < 4 && (
					<View style={styles.medal}>
						<FontAwesome5
							name='medal'
							color={
								rank === 1
									? colors.gold
									: rank === 2
									? colors.silver
									: colors.bronze
							}
							size={26}
						/>
					</View>
				)}
				<View style={styles.scoreTextWrap}>
					<Text style={styles.score}>{`${numberFormat(
						score || 0
					)}`}</Text>
					<Text style={styles.points}>points</Text>
				</View>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderColor: colors.medium,
	},
	rank: {
		paddingRight: 15,
		fontWeight: 'bold',
		fontSize: 30,
	},
	title: {
		color: colors.black,
		fontWeight: 'bold',
	},
	nation: {
		fontSize: 12,
		color: colors.dark,
	},
	points: {
		fontSize: 14,
		color: colors.primary,
	},
	scoreContainer: {
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 15,
		right: 10,
		position: 'absolute',
	},
	scoreTextWrap: {
		alignItems: 'center',
	},
	score: {
		fontSize: 22,
		color: colors.primary,
		fontWeight: 'bold',
	},
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
	},
	medal: {
		paddingTop: 6,
		alignSelf: 'flex-start',
		marginEnd: 2,
	},
});

export default Score;
