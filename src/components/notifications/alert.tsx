import AlertAsync from 'react-native-alert-async';
import Sounds from './Sounds';

const AppAlert = async (title, text, okBtn, cancelBtn) => {
  Sounds.SoundAlert();
  const choice = await AlertAsync(
    title,
    text,
    [
      { text: okBtn || 'Ok', onPress: () => 'yes' },
      { text: cancelBtn || 'Cancel', onPress: () => Promise.resolve('no') },
    ],
    {
      cancelable: true,
      onDismiss: () => 'no',
    }
  );

  if (choice === 'yes') {
    return true;
  } else {
    return 'pass';
  }
};

export default AppAlert;
