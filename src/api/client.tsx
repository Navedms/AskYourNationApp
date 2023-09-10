import { create } from 'apisauce';

import cache from '../utility/cache';
import settings from '../config/settings';
import authStorage from '../auth/storage';
import navigation from '../navigation/rootNavigation';
import routes from '../navigation/routes';

const apiClient = create({
  baseURL: settings.server.url,
});

//intercept requests and add authorization token
apiClient.axiosInstance.interceptors.request.use(async (config: any) => {
  const token = await authStorage.getToken();
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

apiClient.axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      navigation.navigate(routes.WELCOME.name, { logOut: true });
    }
    return Promise.reject(error);
  }
);

const get = apiClient.get;

apiClient.get = async (url, params, axiosConfig): Promise<any> => {
  const response = await get(url, params, axiosConfig);
  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
