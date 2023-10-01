import { Audio } from 'expo-av';

const SoundError = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require('../../../assets/sounds/error.wav')
	);
	await sound.playAsync();
};

const SoundNotification = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require('../../../assets/sounds/popup.wav')
	);
	await sound.playAsync();
};

const SoundOk = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require('../../../assets/sounds/ok.wav')
	);
	await sound.playAsync();
};

const SoundCorrect = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require('../../../assets/sounds/correctAnswer.wav')
	);
	await sound.playAsync();
};

const SoundAlert = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require('../../../assets/sounds/alert.wav')
	);
	await sound.playAsync();
};

const SoundClick = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require('../../../assets/sounds/click.wav')
	);
	await sound.playAsync();
};

export default {
	SoundError,
	SoundNotification,
	SoundOk,
	SoundAlert,
	SoundClick,
	SoundCorrect,
};
