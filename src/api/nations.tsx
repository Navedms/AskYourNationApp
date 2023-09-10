import client from './client';

const endpoint = '/nations';

const get = () => client.get(endpoint);

export default {
  get,
};
