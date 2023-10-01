import AlertAsync from 'react-native-alert-async';
import Sounds from './Sounds';

const AppAlert = async (
	title,
	text,
	sounds,
	okBtn = 'Ok',
	cancelBtn = 'Cancel'
) => {
	sounds && Sounds.SoundAlert();

	const choice = await AlertAsync(
		title,
		text,
		[
			{ text: okBtn, onPress: () => 'yes' },
			{
				text: cancelBtn,
				onPress: () => Promise.resolve('no'),
			},
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
