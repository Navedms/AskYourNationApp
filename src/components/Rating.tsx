import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

import colors from '../config/colors';
import defaultStyle from '../config/style';
import Text from './Text';

interface RatingComponentProps {
	userRate: number;
	setUserRate: (userRate: number) => void;
}

const RatingComponent = ({ userRate, setUserRate }: RatingComponentProps) => {
	return (
		<>
			<Text style={styles.title}>Rate the question:</Text>
			<View style={[styles.container, defaultStyle.rtlRow]}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setUserRate(1)}
					style={styles.star}>
					<AntDesign
						name={userRate ? 'star' : 'staro'}
						color={colors.orange}
						size={24}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setUserRate(2)}
					style={styles.star}>
					<AntDesign
						name={userRate && userRate > 1 ? 'star' : 'staro'}
						color={colors.orange}
						size={24}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setUserRate(3)}
					style={styles.star}>
					<AntDesign
						name={userRate && userRate > 2 ? 'star' : 'staro'}
						color={colors.orange}
						size={24}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setUserRate(4)}
					style={styles.star}>
					<AntDesign
						name={userRate && userRate > 3 ? 'star' : 'staro'}
						color={colors.orange}
						size={24}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setUserRate(5)}
					style={styles.star}>
					<AntDesign
						name={userRate && userRate > 4 ? 'star' : 'staro'}
						color={colors.orange}
						size={24}
					/>
				</TouchableOpacity>
			</View>
		</>
	);
};

export default RatingComponent;

const styles = StyleSheet.create({
	container: {
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		textAlign: 'center',
		color: colors.black,
		fontWeight: 'bold',
	},
	rateMsg: {
		textAlign: 'center',
		color: colors.ok,
		fontWeight: 'bold',
	},
	star: {
		marginHorizontal: 2,
	},
	submit: {
		marginStart: 6,
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: colors.secondary,
		borderRadius: 20,
	},
	submitText: {
		color: colors.white,
		fontSize: 12,
		fontWeight: 'bold',
	},
});
