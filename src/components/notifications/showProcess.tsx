import { showMessage } from 'react-native-flash-message';

import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Sounds from './Sounds';

const showProcess = (msg: string, sound: boolean = false) => {
	sound && Sounds.SoundNotification();
	return showMessage({
		message: msg,
		type: 'info',
		icon: 'auto',
		backgroundColor: colors.dark,
		style: defaultStyle.msg,
		titleStyle: [defaultStyle.errorMsg, defaultStyle.marginStartRtl(8)],
		duration: 5000,
	});
};

export default showProcess;
