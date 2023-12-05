import {
	View,
	ScrollView,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import defaultStyle from '../config/style';
import Modal from './AppModal';
import colors from '../config/colors';

interface ImageSlideProps {
	images: string[] | string;
	imageIndex?: number;
	visible: boolean;
	onClose: () => void;
}

const ImageSlide = ({
	images,
	imageIndex,
	visible,
	onClose,
}: ImageSlideProps) => {
	const [selectIndex, setSelectIndex] = useState<number>(imageIndex || 0);

	useEffect(() => {
		setSelectIndex(imageIndex || 0);
	}, [imageIndex]);

	const handleOnClose = () => {
		setSelectIndex(imageIndex || 0);
		onClose();
	};

	return (
		<Modal visible={visible} setVisible={handleOnClose}>
			<View style={defaultStyle.alignItemsRtl}>
				<View style={styles.fullSize}>
					<Image
						source={{
							uri: Array.isArray(images)
								? images[selectIndex]
								: images,
						}}
						style={styles.image}
						resizeMode='contain'
					/>
				</View>
				{Array.isArray(images) && (
					<ScrollView horizontal>
						{images?.map((img, index) => (
							<TouchableWithoutFeedback
								key={img}
								onPress={() => setSelectIndex(index)}>
								<View
									style={[
										styles.container,
										index === selectIndex && {
											borderWidth: 2,
											borderColor: colors.secondary,
										},
									]}>
									<Image
										source={{ uri: img }}
										style={styles.image}
									/>
								</View>
							</TouchableWithoutFeedback>
						))}
					</ScrollView>
				)}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	fullSize: {
		width: Dimensions.get('screen').width * 0.82,
		maxHeight: Dimensions.get('screen').height * 0.5,
	},
	container: {
		marginVertical: 20,
		borderRadius: 15,
		height: 90,
		justifyContent: 'center',
		alignItems: 'center',
		width: 90,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: colors.dark,
		marginLeft: 8,
		alignSelf: 'flex-end',
	},
	image: {
		width: '100%',
		height: '100%',
	},
});

export default ImageSlide;
