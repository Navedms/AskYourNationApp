import React, { ComponentProps } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import defaultStyle from '../config/style';

export interface AppButtonProps {
	title?: string;
	onPress?: () => void;
	fontWeight?: string;
	fontSize?: number;
	color?: string;
	backgroundColor?: string;
	icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
	image?: string;
	iconColor?: string;
	iconSize?: number;
	style?: Object;
	disabled?: boolean;
}

function AppButton({
	title,
	onPress,
	fontWeight = 'bold',
	fontSize = 18,
	color = 'white',
	backgroundColor = 'primary',
	icon,
	iconColor = 'white',
	iconSize = 22,
	image,
	style,
	disabled,
}: AppButtonProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.5}
			style={[
				styles.button,
				defaultStyle.rtlRow,
				{
					backgroundColor: colors[backgroundColor],
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
			onPress={disabled ? undefined : onPress}>
			{image && (
				<Image
					source={
						image === 'apple'
							? require(`../../assets/apple.png`)
							: require(`../../assets/google.png`)
					}
					style={styles.image}
				/>
			)}
			{title && (
				<Text
					style={[
						{
							color: colors[color],
							fontWeight: fontWeight,
							fontSize: fontSize,
						},
						image && { paddingLeft: 30 },
					]}>
					{title}
				</Text>
			)}
			{icon && (
				<MaterialCommunityIcons
					style={styles.icon}
					name={icon as any}
					size={iconSize}
					color={colors[iconColor]}
				/>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.primary,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 15,
		width: '100%',
		marginVertical: 10,
	},
	icon: {
		paddingLeft: 6,
	},
	image: {
		position: 'absolute',
		width: 30,
		height: 30,
		left: 20,
	},
});

export default AppButton;
