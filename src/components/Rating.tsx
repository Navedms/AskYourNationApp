import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

import colors from '../config/colors';
import defaultStyle from '../config/style';
import Text from './Text';

interface RatingComponentProps {
	id: string;
	handleSubmitRating: (id: string, index: number) => void;
	disabled: boolean;
	rateMsg?: string;
}

const RatingComponent = ({
	id,
	handleSubmitRating,
	disabled = false,
	rateMsg,
}: RatingComponentProps) => {
	const [userRate, setUserRate] = useState<number | undefined>(undefined);

	return (
		<>
			{rateMsg ? (
				<Text style={styles.rateMsg}>{rateMsg}</Text>
			) : (
				<Text style={styles.title}>Rate the question:</Text>
			)}
			{!rateMsg && (
				<View style={[styles.container, defaultStyle.rtlRow]}>
					<TouchableOpacity
						activeOpacity={1}
						disabled={disabled}
						onPress={() => setUserRate(1)}
						style={[styles.star, disabled && { opacity: 0.5 }]}>
						<AntDesign
							name={userRate ? 'star' : 'staro'}
							color={colors.orange}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						disabled={disabled}
						onPress={() => setUserRate(2)}
						style={[styles.star, disabled && { opacity: 0.5 }]}>
						<AntDesign
							name={userRate && userRate > 1 ? 'star' : 'staro'}
							color={colors.orange}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						disabled={disabled}
						onPress={() => setUserRate(3)}
						style={[styles.star, disabled && { opacity: 0.5 }]}>
						<AntDesign
							name={userRate && userRate > 2 ? 'star' : 'staro'}
							color={colors.orange}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						disabled={disabled}
						onPress={() => setUserRate(4)}
						style={[styles.star, disabled && { opacity: 0.5 }]}>
						<AntDesign
							name={userRate && userRate > 3 ? 'star' : 'staro'}
							color={colors.orange}
							size={24}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						disabled={disabled}
						onPress={() => setUserRate(5)}
						style={[styles.star, disabled && { opacity: 0.5 }]}>
						<AntDesign
							name={userRate && userRate > 4 ? 'star' : 'staro'}
							color={colors.orange}
							size={24}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						disabled={!userRate || disabled}
						onPress={() =>
							userRate
								? handleSubmitRating(id, userRate)
								: undefined
						}
						style={[
							styles.submit,
							(disabled || !userRate) && { opacity: 0.5 },
						]}>
						<Text style={styles.submitText}>Rate</Text>
					</TouchableOpacity>
				</View>
			)}
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
