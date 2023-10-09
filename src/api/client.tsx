import { create } from 'apisauce';

import settings from '../config/settings';
import authStorage from '../auth/storage';

const apiClient = create({
	baseURL: settings.url,
});

//intercept requests and add authorization token
apiClient.axiosInstance.interceptors.request.use(async (config: any) => {
	const token = await authStorage.getToken();
	if (token) {
		config.headers.authorization = token;
	}
	return config;
});

export default apiClient;
