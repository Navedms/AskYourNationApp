import React from 'react';
import {
	StyleSheet,
	Modal,
	View,
	TouchableOpacity,
	Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import Button from './Button';
import defaultStyle from '../config/style';

interface AppModal {
	children: JSX.Element | JSX.Element[];
	animationType?: 'none' | 'slide' | 'fade';
	transparent?: boolean;
	visible: boolean;
	setVisible: (visible: boolean) => void;
	closeBtnText?: string;
	closeBtnbackgroundColor?: string;
	closeBtnColor?: string;
	style?: Object;
	closeBtnStyle?: Object;
	onCloseModal?: () => void;
	disabled?: boolean;
}

function AppModal({
	children,
	animationType = 'fade',
	transparent = true,
	visible,
	closeBtnText = 'close',
	closeBtnbackgroundColor = 'darkMedium',
	closeBtnColor = 'white',
	setVisible,
	onCloseModal,
	disabled = false,
	style,
	closeBtnStyle,
}: AppModal) {
	return (
		<Modal
			animationType={animationType}
			transparent={transparent}
			visible={visible}
			onRequestClose={() => {
				onCloseModal && onCloseModal();
				setVisible(!visible);
			}}>
			<View style={styles.fullscreen}>
				<TouchableOpacity
					onPress={() => {
						if (!disabled) {
							onCloseModal && onCloseModal();
							setVisible(!visible);
						}
					}}
					style={[styles.closeTitleBtn, defaultStyle.leftRTL(6)]}>
					<MaterialCommunityIcons
						name='close'
						size={30}
						color={colors.white}
					/>
				</TouchableOpacity>
				<View style={[styles.container, style]}>
					<View style={styles.children}>{children}</View>
					{!disabled && (
						<View style={[styles.closeBtn, closeBtnStyle]}>
							<Button
								title={closeBtnText}
								backgroundColor={closeBtnbackgroundColor}
								color={closeBtnColor}
								onPress={() => {
									onCloseModal && onCloseModal();
									setVisible(!visible);
								}}
							/>
						</View>
					)}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	fullscreen: {
		backgroundColor: colors.opacityBlack,
		flex: 1,
	},
	container: {
		top: '5%',
		left: '5%',
		width: '90%',
		height: '85%',
		backgroundColor: colors.white,
		borderRadius: 10,
		padding: 15,
	},
	closeTitleBtn: {
		top: Platform.OS === 'android' ? 35 : 40,
	},
	children: {
		flex: 1,
		zIndex: 1,
	},
	closeBtn: {
		width: '100%',
	},
});

export default AppModal;
