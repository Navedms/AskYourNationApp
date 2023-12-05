import React, { useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';

import ImageInput from './ImageInput';
import defaultStyle from '../config/style';
import ImageSlide from './ImageSlide';

interface ImageInputListProps {
	imageUris: string[];
	onRemoveImage: (uri: string) => void;
	onAddImage: (uri: string | null) => void;
	onSwitchImage: (uri: string, value: string) => void;
	limit?: number;
	backgroundColor?: string;
	gallery?: boolean;
	camera?: boolean;
	style?: any;
	doBeforeNavigateToCamera?: () => void;
	readOnly?: boolean;
}

function ImageInputList({
	imageUris = [],
	onRemoveImage,
	onAddImage,
	onSwitchImage,
	limit = 0,
	backgroundColor,
	gallery,
	camera,
	style,
	doBeforeNavigateToCamera,
	readOnly,
}: ImageInputListProps) {
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState<number>(0);
	const scrollView = useRef<any>();

	const handleOnChangeImage = (uri: string) => {
		if (readOnly) {
			setImageIndex(imageUris.findIndex((item: string) => item === uri));
			setVisible(true);
		} else {
			onRemoveImage(uri);
		}
	};

	return (
		<View style={[{ maxHeight: 150 }, style]}>
			<ScrollView
				ref={scrollView}
				horizontal
				onContentSizeChange={() => scrollView.current?.scrollToEnd()}>
				<View style={defaultStyle.rtlRow}>
					{imageUris.map((uri) => (
						<View key={uri} style={defaultStyle.marginEndRtl(8)}>
							<ImageInput
								imageUri={uri}
								onChangeImage={(value: string | null) => {
									if (value) {
										onSwitchImage(uri, value);
									} else {
										handleOnChangeImage(uri);
									}
								}}
								backgroundColor={backgroundColor}
								readOnly={readOnly}
							/>
						</View>
					))}
					{!readOnly && (limit > imageUris.length || limit === 0) ? (
						<ImageInput
							onChangeImage={(uri) => onAddImage(uri)}
							backgroundColor={backgroundColor}
							gallery={gallery}
							camera={camera}
							doBeforeNavigateToCamera={doBeforeNavigateToCamera}
						/>
					) : undefined}
				</View>
			</ScrollView>
			<ImageSlide
				images={imageUris}
				imageIndex={imageIndex}
				visible={visible}
				onClose={() => setVisible(false)}
			/>
		</View>
	);
}

export default ImageInputList;
