import Alert from './notifications/alert';

const askBeforeDelete = async (title, msg) => {
  try {
    return await Alert(title, msg);
  } catch (error) {
    return false;
  }
};

export default askBeforeDelete;
