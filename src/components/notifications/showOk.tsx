import { showMessage } from 'react-native-flash-message';

import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Sounds from './Sounds';

const showOk = (msg: string, sound: boolean = true) => {
  sound && Sounds.SoundOk();
  return showMessage({
    message: msg,
    type: 'success',
    icon: 'auto',
    backgroundColor: colors.ok,
    titleStyle: defaultStyle.errorMsg,
    duration: 5000,
  });
};

export default showOk;
