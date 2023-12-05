import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Text from './Text';
import defaultStyle from '../config/style';
import colors from '../config/colors';

interface IconTextBoxProps {
	text: string;
	style?: Object;
	styleContainer?: Object;
	icon?: string;
	backgroundColor?: string;
	iconColor?: string;
	iconSize?: number;
}

function IconTextBox({
	style,
	styleContainer,
	icon = 'information-variant',
	iconColor = colors.black,
	backgroundColor = colors.light,
	iconSize = 16,
	text,
	...otherProps
}: IconTextBoxProps) {
	return (
		<View
			style={[
				defaultStyle.rtlRow,
				styles.iconTextContainer,
				{ backgroundColor },
				styleContainer,
			]}>
			<MaterialCommunityIcons
				name={icon}
				color={iconColor}
				size={iconSize}
			/>
			<Text
				style={[defaultStyle.textAlignJustifyRTL, styles.text, style]}
				{...otherProps}>
				{text}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	iconTextContainer: {
		backgroundColor: colors.light,
		justifyContent: 'flex-start',
		padding: 10,
		borderRadius: 8,
		width: '100%',
	},
	text: {
		paddingHorizontal: 12,
		fontSize: 14,
		color: colors.dark,
	},
});

export default IconTextBox;
