import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import navigation from '../navigation/rootNavigation';

import colors from '../config/colors';
import showError from './notifications/showError';
import routes from '../navigation/routes';
import defaultStyle from '../config/style';
import ImageSlide from './ImageSlide';

interface ImageInputProps {
	imageUri?: string;
	onChangeImage: (value: string | null) => void;
	backgroundColor?: string;
	gallery?: boolean;
	camera?: boolean;
	doBeforeNavigateToCamera?: () => void;
	readOnly?: boolean;
}

function ImageInput({
	imageUri,
	onChangeImage,
	backgroundColor = colors.light,
	gallery = true,
	camera = false,
	doBeforeNavigateToCamera,
	readOnly,
}: ImageInputProps) {
	const route = useRoute();
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		requestPermission();
	}, []);

	const requestPermission = async () => {
		const { granted } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!granted) {
			showError('errors.imageInput.galleryPermissionMsg');
		}
	};

	const handlePress = (cameraOrGallery?: string) => {
		if (readOnly) {
			onChangeImage(null);
		} else {
			if (!imageUri) {
				if (cameraOrGallery === 'gallery' || !camera) {
					selectImage();
				} else if (
					cameraOrGallery === 'camera' ||
					(!gallery && camera)
				) {
					doBeforeNavigateToCamera && doBeforeNavigateToCamera();
					navigation.navigate(routes.CAMERA.name, {
						goBackTo: route.name,
					});
				}
			} else {
				setOpen(true);
			}
		}
	};
	const handlePressDelete = (addNew?: boolean) => {
		Alert.alert(
			addNew ? 'Changing an image' : 'Deleting an image',
			addNew
				? 'Are you sure you want to Change the image?'
				: 'Are you sure you want to delete the image?',
			[
				{
					text: 'Yes',
					onPress: () => {
						onChangeImage(null);
						addNew && selectImage(addNew);
					},
				},
				{ text: 'No' },
			]
		);
	};

	const selectImage = async (addNew?: boolean) => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 0.5,
			});

			if (!result.canceled) onChangeImage(result.assets[0].uri);
		} catch (error) {
			console.log('Error reading an image', error);
		}
	};

	return (
		<>
			{!imageUri && camera && (
				<TouchableOpacity onPress={() => handlePress('camera')}>
					<View
						style={[
							styles.container,
							{
								backgroundColor: backgroundColor,
							},
							gallery &&
								camera && {
									width: 50,
									...defaultStyle.borderTopEndRadiusRTL(0),
									...defaultStyle.borderBottomEndRadiusRTL(0),
									...defaultStyle.borderEndWidthRTL(0),
									...defaultStyle.marginEndRtl(-2),
								},
						]}>
						<MaterialCommunityIcons
							name='camera-plus'
							size={gallery ? 32 : 60}
							color={colors.dark}
						/>
					</View>
				</TouchableOpacity>
			)}
			{!imageUri && gallery && (
				<TouchableOpacity onPress={() => handlePress('gallery')}>
					<View
						style={[
							styles.container,
							{
								backgroundColor: backgroundColor,
							},
							gallery &&
								camera && {
									width: 50,
									...defaultStyle.borderTopStartRadiusRTL(0),
									...defaultStyle.borderBottomStartRadiusRTL(
										0
									),
								},
						]}>
						<MaterialCommunityIcons
							name='camera-plus'
							size={camera ? 32 : 60}
							color={colors.dark}
						/>
					</View>
				</TouchableOpacity>
			)}

			{imageUri && (
				<View style={defaultStyle.rtlRow}>
					<TouchableOpacity onPress={() => handlePress()}>
						<View
							style={[
								styles.container,
								{
									backgroundColor: backgroundColor,
								},
							]}>
							<Image
								source={{ uri: imageUri }}
								style={styles.image}
							/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.switchContainer,
							defaultStyle.marginStartRtl(-21),
						]}
						onPress={() => handlePressDelete(true)}>
						<MaterialCommunityIcons
							name='camera-retake'
							size={22}
							color={colors.white}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.deleteContainer,
							defaultStyle.marginStartRtl(-60),
							defaultStyle.marginEndRtl(20),
						]}
						onPress={() => handlePressDelete()}>
						<MaterialCommunityIcons
							name='delete'
							size={22}
							color={colors.white}
						/>
					</TouchableOpacity>
				</View>
			)}
			{imageUri && (
				<ImageSlide
					images={imageUri}
					onClose={() => setOpen(false)}
					visible={open}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 75,
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		width: 150,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: colors.black,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	deleteContainer: {
		width: 36,
		height: 36,
		backgroundColor: colors.delete,
		borderRadius: 18,
		alignSelf: 'flex-end',
		justifyContent: 'center',
		alignItems: 'center',
	},
	switchContainer: {
		width: 36,
		height: 36,
		backgroundColor: colors.secondary,
		borderRadius: 18,
		top: -36,
		alignSelf: 'flex-end',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ImageInput;
