import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	Platform,
	Image,
	TouchableWithoutFeedback,
} from 'react-native';
import colors from '../config/colors';
import { FontAwesome5 } from '@expo/vector-icons';

import Text from './Text';
import numberFormat from '../utility/numberFormat';
import { Nation, Points, User } from '../api/auth';
import defaultStyle from '../config/style';
import Icon from './Icon';
import ImageSlide from './ImageSlide';

interface ScoreProps {
	id: string;
	title: string;
	score?: number;
	points?: Points;
	rank: number;
	nation?: Nation;
	profilePic?: string | string[];
	answeredQuestions: number;
	lastActivity?: Date;
	user: User | null;
}

function Score({
	id,
	title,
	score,
	points,
	nation,
	profilePic,
	rank,
	answeredQuestions,
	lastActivity,
	user,
}: ScoreProps) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<TouchableWithoutFeedback onPress={() => setOpen(true)}>
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
				<View style={defaultStyle.marginEndRtl(8)}>
					{profilePic ? (
						nation?.flag ? (
							<View
								style={[
									defaultStyle.rtlRow,
									styles.imageContainer,
								]}>
								<Image
									style={[
										styles.image,
										{ width: 50, height: 50 },
									]}
									source={{
										uri: profilePic as string,
									}}
								/>
								<View
									style={[
										styles.flagImg,
										defaultStyle.marginStartRtl(-20),
									]}>
									<Text style={styles.flagTextImg}>
										{nation.flag}
									</Text>
								</View>
							</View>
						) : (
							<Image
								style={[
									styles.image,
									{ width: 50, height: 50 },
									defaultStyle.marginEndRtl(5),
								]}
								source={{
									uri: profilePic as string,
								}}
							/>
						)
					) : nation?.flag ? (
						<View
							style={[styles.flag, defaultStyle.marginEndRtl(5)]}>
							<Text style={styles.flagText}>{nation.flag}</Text>
						</View>
					) : (
						<Icon
							name='flag-variant'
							backgroundColor={colors.light}
							iconColor={colors.dark}
							size={50}
							style={{
								borderColor: colors.medium,
								borderWidth: 1,
								...defaultStyle.marginEndRtl(5),
							}}
						/>
					)}
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.title} numberOfLines={2}>
						{title}
					</Text>
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
				<ImageSlide
					images={profilePic}
					title={title}
					score={score}
					points={points}
					nation={nation}
					rank={rank}
					answeredQuestions={answeredQuestions}
					lastActivity={lastActivity}
					onClose={() => setOpen(false)}
					visible={open}
				/>
			</View>
		</TouchableWithoutFeedback>
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
	textContainer: {
		width: '50%',
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
		height: 50,
		width: 50,
		borderRadius: 25,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagText: {
		fontSize: Platform.OS === 'android' ? 25 : 29,
		paddingBottom: Platform.OS === 'android' ? 2 : 0,
	},
	medal: {
		paddingTop: 6,
		alignSelf: 'flex-start',
		marginEnd: 2,
	},
	flagImg: {
		backgroundColor: colors.light,
		height: 25,
		width: 25,
		marginBottom: -2,
		borderRadius: 12.5,
		borderColor: colors.medium,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagTextImg: {
		fontSize: Platform.OS === 'android' ? 10.5 : 12.5,
		marginTop: Platform.OS === 'android' ? -1 : -2,
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	image: {
		borderRadius: 25,
		borderWidth: 1,
		borderColor: colors.medium,
	},
});

export default Score;
