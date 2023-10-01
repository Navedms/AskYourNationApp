import React, { useEffect, ComponentProps, ReactNode } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { useFormikContext } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Text from '../Text';

interface Item {
	id: string;
	value?: string;
	icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
}
interface AppFormGroupPickerProps {
	list: Item[];
	firstValue?: string;
	name: string;
	label?: string;
	border?: number;
	backgroundColor?: string;
	labelColor?: string;
	width?: number;
	fixedPadding?: number;
	disabled?: boolean;
	onChange?: (name: string, value: string) => void;
	style?: Object;
	onClose?: (value: string) => void;
	returnInArry?: boolean;
	verticalElementInIT?: any;
}

function AppFormGroupPicker({
	list,
	firstValue,
	name,
	label,
	border = 1,
	backgroundColor = colors.light,
	labelColor = colors.black,
	width = 1,
	fixedPadding = 40,
	disabled,
	onChange,
	style,
	returnInArry = false,
}: AppFormGroupPickerProps) {
	const { setFieldValue, errors, touched, values } = useFormikContext();

	const windowWidth = (Dimensions.get('window').width - fixedPadding) * width;

	const handleFirstValue = (firstValue: string | undefined): void => {
		if (returnInArry) {
			setFieldValue(name, [firstValue]);
		} else {
			setFieldValue(name, firstValue);
		}
	};

	useEffect(() => {
		handleFirstValue(firstValue);
	}, [firstValue]);

	const handleValueChange = (value: string) => {
		onChange && onChange(name, value);
		setFieldValue(name, value);
	};

	return (
		<>
			<View
				style={[
					styles.container,
					style,
					{
						backgroundColor: backgroundColor,
						width: windowWidth,
					},
				]}>
				{label && <Text style={{ color: labelColor }}>{label}</Text>}
				<View style={[defaultStyle.rtlRow, styles.itemsContainer]}>
					{list?.map((item, index) => (
						<TouchableOpacity
							key={item.id}
							style={[
								styles.item,
								defaultStyle.rtlRow,
								{
									width: windowWidth / list.length,
									borderWidth: border,
									backgroundColor: backgroundColor,
								},
								(item.id === values[name] ||
									(item.id === firstValue &&
										!values[name])) && {
									...styles.selectItem,
								},
							]}
							onPress={() =>
								disabled
									? undefined
									: handleValueChange(item.id)
							}>
							{item.icon && (
								<MaterialCommunityIcons
									name={item.icon}
									size={28}
									color={
										item.id === values[name] ||
										(item.id === firstValue &&
											!values[name])
											? colors.white
											: colors.dark
									}
								/>
							)}
							{item.value && (
								<Text
									style={
										(item.id === values[name] ||
											(item.id === firstValue &&
												!values[name])) && {
											color: colors.white,
											fontWeight: 'bold',
										}
									}>
									{item.value}
								</Text>
							)}
						</TouchableOpacity>
					))}
				</View>
			</View>
			<ErrorMessage error={errors[name]} visible={touched[name]} />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		alignItems: 'flex-start',
		justifyContent: 'center',
		width: '100%',
	},
	icon: {
		marginLeft: 10,
		marginRight: 14,
		marginVertical: 12,
	},
	select: {
		textAlign: 'left',
		marginHorizontal: 10,
		color: colors.dark,
		paddingVertical: 14,
	},
	itemsContainer: {
		justifyContent: 'center',
		width: '100%',
		minHeight: 46,
	},
	item: {
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: colors.medium,
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	selectItem: {
		backgroundColor: colors.primary,
	},
});

export default AppFormGroupPicker;
