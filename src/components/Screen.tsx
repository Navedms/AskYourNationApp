import React, { useEffect } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import colors from '../config/colors';

interface ScreenProps {
	children: JSX.Element | JSX.Element[];
	style?: Object;
	onPress?: () => void;
	titleColor?: string;
	backgroundColor?: string;
}

function Screen({
	children,
	style,
	onPress,
	titleColor,
	backgroundColor = colors.white,
}: ScreenProps) {
	return (
		<View style={[styles.screen, { backgroundColor: titleColor }, style]}>
			{onPress ? (
				<TouchableWithoutFeedback onPress={onPress}>
					<View
						style={[
							styles.view,
							{ backgroundColor: backgroundColor },
							style,
						]}>
						{children}
					</View>
				</TouchableWithoutFeedback>
			) : (
				<View
					style={[
						styles.view,
						{ backgroundColor: backgroundColor },
						style,
					]}>
					{children}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		flex: 1,
	},
	view: {
		flex: 1,
	},
});

export default Screen;
