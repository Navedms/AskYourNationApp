import React, { useState, memo } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Platform,
	Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Text from './Text';
import colors from '../config/colors';
import defaultStyle from '../config/style';
import { AmountOfanswers, Rating } from '../api/questions';
import numberFormat from '../utility/numberFormat';
import Icon from './Icon';

interface CardItemProps {
	itemKey?: string;
	title: string;
	subTitle?: string;
	image?: string;
	sizeImg?: number;
	IconComponent?: any;
	SwitchComponent?: any;
	onPress?: () => void;
	edit?: boolean;
	renderLeftActions?: any;
	closeAfterPress?: boolean;
	bold?: boolean;
	marginVertical?: number;
	rating?: Rating;
	amountOfanswers?: AmountOfanswers;
}

function CardItem({
	itemKey,
	title,
	subTitle,
	image,
	sizeImg = 70,
	IconComponent,
	SwitchComponent,
	onPress,
	edit = false,
	renderLeftActions,
	closeAfterPress = true,
	bold = false,
	marginVertical = 0,
	rating,
	amountOfanswers,
}: CardItemProps) {
	const [openSwipe, setOpenSwipe] = useState('gesture-swipe-right');
	let rowRefs = new Map();

	return (
		<Swipeable
			key={itemKey}
			renderRightActions={renderLeftActions}
			onSwipeableOpen={() => setOpenSwipe('gesture-swipe-left')}
			onSwipeableClose={() => setOpenSwipe('gesture-swipe-right')}
			onBegan={() => {
				[...rowRefs.entries()].forEach(([key, ref]) => {
					if (key === itemKey && ref && closeAfterPress) ref.close();
				});
			}}
			ref={(ref) => {
				if (ref && !rowRefs.get(itemKey)) {
					rowRefs.set(itemKey, ref);
				}
			}}>
			<TouchableOpacity
				underlayColor={colors.light}
				onPress={onPress}
				activeOpacity={!onPress ? 1 : 0.5}>
				<View
					style={[
						styles.border,
						{
							marginVertical,
						},
					]}>
					<View style={[defaultStyle.rtlRow, styles.container]}>
						<View
							style={[defaultStyle.rtlRow, styles.containerBody]}>
							{image && image !== 'placeHolder' && (
								<Image
									style={[
										styles.image,
										{ width: sizeImg, height: sizeImg },
									]}
									source={{
										uri: image,
									}}
								/>
							)}
							{image === 'placeHolder' && (
								<Icon
									name='camera-plus'
									backgroundColor={colors.medium}
									size={sizeImg}
									style={styles.image}
								/>
							)}
							{IconComponent}
							<View
								style={[
									styles.detailsContainer,
									defaultStyle.alignItemsRtl,
									renderLeftActions && {
										width: '78%',
									},
									(SwitchComponent || image) && {
										width: '65%',
									},
								]}>
								<Text
									style={[
										styles.title,
										bold && { fontWeight: 'bold' },
									]}
									numberOfLines={1}>
									{title}
								</Text>
								{subTitle && (
									<Text
										style={[styles.subTitle]}
										numberOfLines={1}>
										{subTitle}
									</Text>
								)}
								{rating && (
									<View
										style={[
											styles.dataContainer,
											defaultStyle.alignItemsRtl,
										]}>
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
												{amountOfanswers?.all > 0 &&
												amountOfanswers?.correct > 0
													? `${numberFormat(
															amountOfanswers.correct
													  )} out of ${numberFormat(
															amountOfanswers.all
													  )} answered correctly (${(
															(amountOfanswers.correct /
																amountOfanswers.all) *
															100
													  ).toFixed(0)}%)`
													: 'No one has answered this question yet'}
											</Text>
										</View>
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
												{rating?.value &&
												rating?.numberOfRatings
													? `Rating: ${rating.value.toFixed(
															1
													  )} out of 5 (${numberFormat(
															rating.numberOfRatings
													  )} ratings)`
													: 'No one has rated this question yet'}
											</Text>
										</View>
									</View>
								)}
							</View>
						</View>
						{SwitchComponent && (
							<View style={styles.switch}>{SwitchComponent}</View>
						)}
						{edit && (
							<MaterialCommunityIcons
								color={colors.medium}
								name='lead-pencil'
								size={20}
							/>
						)}
						{renderLeftActions && (
							<MaterialCommunityIcons
								color={colors.darkMedium}
								name={openSwipe}
								size={30}
							/>
						)}
					</View>
				</View>
			</TouchableOpacity>
		</Swipeable>
	);
}

const styles = StyleSheet.create({
	border: {
		borderBottomWidth: 1,
		borderColor: colors.light,
		backgroundColor: colors.white,
		padding: 15,
	},
	container: {
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	containerBody: {
		alignItems: 'center',
	},
	detailsContainer: {
		marginHorizontal: 10,
		justifyContent: 'center',
		width: '100%',
	},
	title: {
		fontSize: 18,
		textAlign: 'left',
	},
	subTitle: {
		color: colors.dark,
		textAlign: 'left',
	},
	image: {
		borderRadius: 35,
		borderWidth: 1,
		borderColor: colors.darkMedium,
	},
	switch: {
		alignSelf: 'center',
	},
	dataContainer: {
		alignSelf: 'flex-start',
		width: '100%',
		marginTop: 5,
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	ratingContainer: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	ratingText: {
		paddingVertical: 2,
		paddingStart: 4,
		color: colors.dark,
		fontSize: 12,
	},
});

export default memo(CardItem);
