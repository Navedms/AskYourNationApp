import { showMessage } from 'react-native-flash-message';

import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Sounds from './Sounds';

const showError = (msg: string, sound: boolean = true) => {
	sound && Sounds.SoundError();
	return showMessage({
		message: msg,
		type: 'danger',
		icon: 'auto',
		backgroundColor: colors.delete,
		style: defaultStyle.msg,
		titleStyle: [defaultStyle.errorMsg, defaultStyle.marginStartRtl(8)],
		duration: 5000,
	});
};

export default showError;
