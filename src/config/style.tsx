import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';

import colors from './colors';

const { textDirection } = getLocales()[0];

export default {
	colors,
	rtlRow: {
		flexDirection:
			Platform.OS === 'android' && textDirection === 'rtl'
				? 'row-reverse'
				: 'row',
	},
	text: {
		color: colors.black,
		fontSize: Platform.OS === 'android' ? 18 : 16,
		fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
	},
	errorMsg: {
		fontSize: 16,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	alignSelfStartRtl: {
		alignSelf:
			Platform.OS === 'android' && textDirection === 'rtl'
				? 'flex-end'
				: 'flex-start',
	},
	alignItemsRtl: {
		alignItems:
			Platform.OS === 'android' && textDirection === 'rtl'
				? 'flex-end'
				: 'flex-start',
	},
	alignItemsEndRtl: {
		alignItems:
			Platform.OS === 'android' && textDirection === 'rtl'
				? 'flex-start'
				: 'flex-end',
	},
	msg: {
		flexDirection:
			Platform.OS === 'android' && textDirection === 'rtl'
				? 'row-reverse'
				: 'row',
	},
	leftOrRight: {
		left:
			Platform.OS === 'android' && textDirection === 'rtl' ? 30 : 'auto',
		right:
			Platform.OS === 'android' && textDirection === 'rtl' ? 'auto' : 0,
	},
	textAlignRTL: {
		textAlign:
			Platform.OS === 'android' && textDirection === 'rtl'
				? 'right'
				: 'left',
	},
	marginStartRtl: (margin: number) => {
		return Platform.OS === 'android' && textDirection === 'rtl'
			? {
					marginEnd: margin,
			  }
			: { marginStart: margin };
	},
	marginEndRtl: (margin: number) => {
		return Platform.OS === 'android' && textDirection === 'rtl'
			? {
					marginStart: margin,
			  }
			: { marginEnd: margin };
	},
};
