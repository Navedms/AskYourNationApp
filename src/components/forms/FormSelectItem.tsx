import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormikContext } from 'formik';

import Text from '../Text';
import defaultStyle from '../../config/style';

import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';

interface FormSelectItemProps {
	name: string;
	title: string;
	colorIcon?: string;
	onPress: (value: boolean, name: string) => void;
	firstValue: boolean;
}

function FormSelectItem({
	name,
	title,
	colorIcon = colors.primary,
	onPress,
	firstValue = false,
}: FormSelectItemProps) {
	const { setFieldValue, errors, touched } = useFormikContext();
	const [value, setValue] = useState<boolean | undefined>(firstValue);

	const handleFirstValue = (firstValue: boolean | undefined): void => {
		setValue(firstValue);
		setFieldValue(name, firstValue);
	};

	const handleOnPress = () => {
		onPress(!value, name);
	};

	useEffect(() => {
		handleFirstValue(firstValue);
	}, [firstValue]);

	return (
		<>
			<TouchableOpacity onPress={handleOnPress}>
				<View style={[defaultStyle.rtlRow, styles.container]}>
					<View style={defaultStyle.paddingRTL(0, 5)}>
						<MaterialCommunityIcons
							name={
								value
									? 'checkbox-marked'
									: 'checkbox-blank-outline'
							}
							size={30}
							color={colorIcon}
						/>
					</View>
					<Text style={styles.text}>{title}</Text>
				</View>
			</TouchableOpacity>
			<ErrorMessage error={errors[name]} visible={touched[name]} />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 6,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		paddingTop: 2,
		width: '89%',
		lineHeight: 20,
	},
});

export default FormSelectItem;
