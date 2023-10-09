import Constants from 'expo-constants';

const settings = {
	dev: {
		url: `http://${Constants.expoConfig?.hostUri?.split(':')[0]}:1337/api`, // DEV
	},
	prod: {
		url: 'https://curious-leather-jacket-elk.cyclic.app/api', // PROD
	},
};

const getCurrentSettings = () => {
	if (__DEV__) return settings.dev;
	return settings.prod;
};

export default getCurrentSettings();
