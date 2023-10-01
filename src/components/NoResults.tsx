import React from 'react';
import { View, StyleSheet } from 'react-native';

import Text from './Text';
import colors from '../config/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NoResultsProps {
	title: string;
	text: string;
	iconName: string;
	iconColor?: string;
	flex?: boolean;
	button?: any;
}

function NoResults({
	title,
	text,
	iconName,
	iconColor = colors.dark,
	flex = true,
	button,
}: NoResultsProps) {
	return (
		<View style={[styles.container, flex && styles.fullScreen]}>
			{iconName && (
				<MaterialCommunityIcons
					name={iconName}
					size={48}
					style={styles.icon}
					color={iconColor}
				/>
			)}
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.text}>{text}</Text>
			{button && <View style={styles.btn}>{button}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.white,
		width: '100%',
		zIndex: 2,
	},
	fullScreen: {
		flexGrow: 1,
		zIndex: 0,
	},
	icon: {
		paddingBottom: 20,
	},
	title: {
		fontSize: 22,
		textAlign: 'center',
	},
	text: {
		paddingTop: 2,
		fontSize: 16,
		color: colors.dark,
		textAlign: 'center',
	},
	btn: {
		width: '90%',
		marginVertical: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default NoResults;
