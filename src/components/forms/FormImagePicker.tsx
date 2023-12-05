import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { StyleSheet, View } from 'react-native';
import settings from '../../config/settings';
import ImageInputList from '../ImageInputList';
import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import Text from '../Text';
import defaultStyle from '../../config/style';

interface FormImagePickerProps {
	name: string;
	limit: number;
	onChange: (name: string, values: string[]) => void;
	firstValue?: string[];
	title?: string;
	backgroundColor?: string;
	gallery?: boolean;
	camera?: boolean;
	doBeforeNavigateToCamera?: () => void;
	readOnly?: boolean;
	style?: any;
}

function FormImagePicker({
	name,
	limit,
	firstValue,
	onChange,
	title,
	style,
	backgroundColor,
	gallery,
	camera,
	doBeforeNavigateToCamera,
	readOnly = false,
}: FormImagePickerProps) {
	const { errors, setFieldValue, touched, values } = useFormikContext();

	const imageUris = values[name];

	useEffect(() => {
		const imageUrisStart =
			values[name]?.length > 0
				? values[name]
				: !firstValue?.length ||
				  (Object.keys(firstValue).length === 0 &&
						firstValue.constructor === Object)
				? []
				: firstValue.map((value) => value);

		setFieldValue(name, imageUrisStart);
	}, []);

	const handleAdd = (uri: string | null) => {
		setFieldValue(name, [...imageUris, uri]);
		onChange(name, [...imageUris, uri]);
	};

	const handleRemove = (uri: string) => {
		const newArrAfterRemove = imageUris.filter(
			(imageUri: string) => imageUri !== uri
		);
		setFieldValue(name, newArrAfterRemove);
		onChange(name, newArrAfterRemove);
	};

	const handleSwitch = (uri: string, value: string) => {
		const newArrAfterRemove = imageUris.filter(
			(imageUri: string) => imageUri !== uri
		);
		setFieldValue(name, [...newArrAfterRemove, value]);
		onChange(name, [...newArrAfterRemove, value]);
	};

	return (
		<View style={[styles.container, defaultStyle.alignItemsRtl]}>
			{title && <Text style={styles.logoText}>{title}</Text>}
			<ImageInputList
				imageUris={imageUris}
				onAddImage={handleAdd}
				onRemoveImage={handleRemove}
				onSwitchImage={handleSwitch}
				limit={limit}
				gallery={gallery}
				camera={camera}
				readOnly={readOnly}
				backgroundColor={backgroundColor}
				style={style}
				doBeforeNavigateToCamera={doBeforeNavigateToCamera}
			/>
			<ErrorMessage
				style={styles.error}
				error={errors[name]}
				visible={touched[name]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		flexShrink: 1,
	},
	logoText: {
		color: colors.dark,
		paddingRight: 5,
		paddingVertical: 8,
	},
	error: {
		width: '100%',
		paddingTop: 8,
	},
});

export default FormImagePicker;
