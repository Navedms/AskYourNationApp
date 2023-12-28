import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

import defaultStyle from '../config/style';
import Modal from './AppModal';
import colors from '../config/colors';
import { Nation, Points } from '../api/auth';
import Text from './Text';
import numberOrdinal from '../utility/numberOrdinal';
import numberFormat from '../utility/numberFormat';
import CardItem from './cardItem';
import Icon from './Icon';

interface ImageSlideProps {
	images?: string[] | string;
	imageIndex?: number;
	visible: boolean;
	onClose: () => void;
	title?: string;
	score?: number;
	points?: Points;
	rank?: number;
	nation?: Nation;
	answeredQuestions: number;
	lastActivity?: Date;
}

interface ImgFullSize {
	imgWidth: number;
	imgHeight: number;
}

const ImageSlide = ({
	images,
	imageIndex,
	visible,
	onClose,
	title,
	score,
	points,
	nation,
	rank,
	answeredQuestions,
	lastActivity,
}: ImageSlideProps) => {
	const [selectIndex, setSelectIndex] = useState<number>(imageIndex || 0);
	const [fullSize, setFullSize] = useState<ImgFullSize | undefined>(
		undefined
	);
	const showAnswersDetails =
		!!answeredQuestions &&
		!!points &&
		!!points.questions &&
		!!points.answers;

	useEffect(() => {
		setSelectIndex(imageIndex || 0);

		if (
			(Array.isArray(images) && images.length > 0) ||
			(!Array.isArray(images) && images)
		) {
			Image.getSize(
				Array.isArray(images) ? images[selectIndex] : images,
				(width, height) => {
					const screenWidth = Dimensions.get('window').width * 0.9;
					const scaleFactor = width / screenWidth;
					const imageHeight = height / scaleFactor;
					setFullSize({
						imgWidth: screenWidth,
						imgHeight: imageHeight,
					});
				}
			);
		}
	}, [imageIndex]);

	const handleOnClose = () => {
		setSelectIndex(imageIndex || 0);
		onClose();
	};

	return (
		<Modal
			visible={visible}
			setVisible={handleOnClose}
			closeBtnStyle={styles.closeBtnStyle}
			style={styles.modalContainer}>
			<ScrollView
				contentContainerStyle={[
					defaultStyle.alignItemsRtl,
					styles.container,
				]}>
				<View style={styles.titleContainer}>
					{title && <Text style={styles.title}>{title}</Text>}
					{nation && (
						<Text style={styles.subTitle}>
							{`${nation?.flag} ${nation?.name}`}
						</Text>
					)}
				</View>
				{lastActivity && (
					<CardItem
						title={`Last activity: ${dayjs(
							lastActivity
						).fromNow()}`}
						IconComponent={
							<Icon
								name='timer-sand-complete'
								backgroundColor={colors.primary}
							/>
						}
					/>
				)}
				{rank && (
					<CardItem
						title={`Rank: ${numberOrdinal(rank)}`}
						subTitle={`Points: ${numberFormat(score)}`}
						IconComponent={
							<Icon
								name='medal'
								backgroundColor={colors.secondary}
							/>
						}
					/>
				)}
				{showAnswersDetails && (
					<CardItem
						title={`Answered correctly ${numberFormat(
							points?.answers
						)}/${answeredQuestions} (${(
							(points?.answers / answeredQuestions) *
							100
						).toFixed(0)}%)`}
						subTitle={`Write ${numberFormat(
							points?.questions
						)} questions`}
						IconComponent={
							<Icon
								name='star'
								backgroundColor={colors.secondary}
							/>
						}
					/>
				)}
				{images && (
					<View
						style={{
							width: fullSize?.imgWidth,
							height: fullSize?.imgHeight,
							paddingHorizontal: 15,
						}}>
						<Image
							source={{
								uri: Array.isArray(images)
									? images[selectIndex]
									: images,
							}}
							style={styles.image}
							resizeMode='contain'
						/>
					</View>
				)}
			</ScrollView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		padding: 0,
		paddingVertical: 15,
	},
	closeBtnStyle: {
		paddingHorizontal: 15,
	},
	container: {
		paddingTop: 5,
		width: '100%',
	},
	titleContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 20,
	},
	title: {
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 22,
	},
	subTitle: {
		textAlign: 'center',
		color: colors.dark,
	},
	image: {
		width: '100%',
		height: '100%',
	},
});

export default ImageSlide;
