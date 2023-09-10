import client from './client';

const endpoint = '/user/profile';

const get = (admin) => client.get(`${endpoint}/${admin}`);

const add = (id, values, logoChange) => {
  const data = new FormData();

  data.append('id', id);
  data.append('firstName', values.firstName);
  data.append('lastName', values.lastName);
  data.append('companyName', values.companyName);

  if (values.logoImg.length === 0) {
    data.append('deletlogoImg', true);
  }

  if (values.logoImg && logoChange) {
    values.logoImg.forEach((image, index) => {
      data.append('images', {
        name: 'logo' + index,
        type: 'image/jpeg',
        uri: image,
      });
    });
  }
  return client.post(endpoint, data);
};

const savePushToken = (item: { id: string; pushToken: string }) =>
  client.patch(`${endpoint}/save-push-token`, item);

const sendPushNotification = (item: { title: string; message: string }) =>
  client.post(`${endpoint}/patrol/push-notification`, item);

export default {
  add,
  savePushToken,
  sendPushNotification,
  get,
};
