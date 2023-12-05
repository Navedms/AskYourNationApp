import React, {
	ComponentProps,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useFormikContext } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Text from '../Text';
import TextInput from '../AppTextInput';
import { TouchableOpacity } from 'react-native';

export interface Item {
	value: string;
	id: string;
}

interface AppFormListMakerProps {
	resetFields: boolean;
	firstValue?: Item[];
	firstSelectValue?: number;
	name: string;
	selectName: string;
	icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
	placeholder: string;
	optionPlaceholder?: string;
	border?: number;
	backgroundColor?: string;
	placeholderColor?: string;
	width?: number;
	fixedPadding?: number;
	maxLength?: number;
	onChange?: (name: string, value: Item[] | null) => void;
	onPress?: (name: string, value: number) => void;
	allowAnyText?: boolean;
	style?: Object;
}

function AppFormListMaker({
	resetFields,
	firstValue,
	firstSelectValue,
	name,
	selectName,
	icon,
	placeholder,
	optionPlaceholder = 'Add Option',
	border = 1,
	backgroundColor = colors.veryLight,
	placeholderColor = colors.dark,
	width = 1,
	fixedPadding = 40,
	maxLength,
	onChange,
	onPress,
	allowAnyText,
	style,
}: AppFormListMakerProps) {
	const { setFieldValue, errors, touched } = useFormikContext();
	const [value, setValue] = useState<Item[]>(firstValue || []);
	const [selectValue, setSelectValue] = useState<number | undefined>(
		firstSelectValue
	);

	const windowWidth = (Dimensions.get('window').width - fixedPadding) * width;

	const handleFirstValue = (firstValue: Item[]) => {
		if (firstValue?.length > 0) {
			setFieldValue(name, firstValue);
			setValue(firstValue);
		} else if (firstValue?.length === 0) {
			handleAddOptions();
		}
	};

	const handleFirstSelectValue = (firstSelectValue: number) => {
		setSelectValue(firstSelectValue);
		setFieldValue(selectName, firstSelectValue);
	};

	const handleOnChangeText = (id: string, text: string) => {
		if (!allowAnyText) {
			text = text.replace(
				/[^0-9a-zA-Z .,;:)(!?@#$%^&~<>{}*+-_=/)""'']/gi,
				''
			);
		}
		const index = value.findIndex((obj) => obj.id == id);
		const newValueList = value;
		newValueList[index].value = text;
		setValue(newValueList);

		onChange && onChange(name, newValueList);
		setFieldValue(name, newValueList);
	};

	useEffect(() => {
		handleFirstValue(firstValue);
	}, [firstValue]);

	useEffect(() => {
		handleFirstSelectValue(firstSelectValue);
	}, [firstSelectValue]);

	const handleAddOptions = () => {
		setValue([
			{ id: `option-1`, value: '' },
			{ id: `option-2`, value: '' },
			{ id: `option-3`, value: '' },
			{ id: `option-4`, value: '' },
		]);
	};

	const handleSelectOption = async (index: number) => {
		setSelectValue(index);
		onPress && onPress(selectName, index);
	};

	return (
		<>
			<View
				style={[
					styles.container,
					style,
					{
						backgroundColor: backgroundColor,
						borderWidth: border,
						width: windowWidth,
					},
				]}>
				<View style={[defaultStyle.rtlRow, styles.header]}>
					<View style={[defaultStyle.rtlRow, styles.headerInner]}>
						{icon && (
							<MaterialCommunityIcons
								name={icon}
								size={28}
								color={colors.dark}
								style={styles.icon}
							/>
						)}
						<Text
							style={{
								color: placeholderColor,
								maxWidth: '85%',
							}}>
							{placeholder}
						</Text>
					</View>
				</View>
				{value?.map((item: Item, index: number) => (
					<View
						key={item.id}
						style={[defaultStyle.rtlRow, styles.listContainer]}>
						<View style={[defaultStyle.rtlRow, styles.headerInner]}>
							<Text
								style={{
									color: colors.dark,
									fontWeight: 'bold',
								}}>{`.${(index + 1).toString()}`}</Text>
							<TextInput
								key={`option-${resetFields}-${index}`}
								value={item.value}
								style={[
									styles.textInput,
									{ backgroundColor: backgroundColor },
								]}
								onChangeText={(value: any) =>
									handleOnChangeText(item.id, value)
								}
								placeholder={optionPlaceholder}
								noLabel={true}
								maxLength={maxLength}
							/>
						</View>
						<TouchableOpacity
							onPress={() => handleSelectOption(index)}
							disabled={!item.value}>
							<MaterialCommunityIcons
								name={
									index === selectValue
										? 'check-circle-outline'
										: 'checkbox-blank-circle-outline'
								}
								size={26}
								color={
									!item.value
										? colors.disabled
										: index === selectValue
										? colors.primary
										: colors.darkMedium
								}
							/>
						</TouchableOpacity>
					</View>
				))}
			</View>
			<ErrorMessage
				error={
					errors[name]
						? Object.values(errors[name][errors[name]?.length - 1])
						: ''
				}
				visible={touched[name]}
			/>
			<ErrorMessage
				error={errors[selectName]}
				visible={touched[selectName]}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		marginVertical: 10,
		paddingBottom: 15,
		justifyContent: 'flex-start',
		zIndex: 1,
		width: '100%',
	},
	header: {
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	headerInner: {
		alignItems: 'center',
	},
	listContainer: {
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 15,
	},
	addBtn: {
		alignSelf: 'flex-end',
	},
	icon: {
		marginLeft: 10,
		marginRight: 14,
		marginVertical: 12,
	},
	textInput: {
		borderRadius: 0,
		borderBottomColor: colors.dark,
		borderBottomWidth: 1,
		width: '90%',
	},
});

export default AppFormListMaker;
