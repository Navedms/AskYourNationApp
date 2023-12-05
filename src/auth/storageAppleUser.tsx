import * as SecureStore from 'expo-secure-store';

const key = 'appleUser';

const storeFullName = async (fullName: any) => {
	try {
		await SecureStore.setItemAsync(key, fullName);
	} catch (error) {
		console.log('Error storing the auth token', error);
	}
};

const getFullName = async () => {
	try {
		return await SecureStore.getItemAsync(key);
	} catch (error) {
		console.log('Error getting the auth token', error);
	}
};

export default { getFullName, storeFullName };
