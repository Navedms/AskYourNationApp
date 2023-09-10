import Constants from 'expo-constants';

export default {
  server: {
    url: `http://${Constants.expoConfig?.hostUri?.split(':')[0]}:1337/api`, // HOME
  },
};
