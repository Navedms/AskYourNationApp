import Alert from './notifications/alert';

const askBeforeDelete = async (title, msg, sounds) => {
	try {
		return await Alert(title, msg, sounds);
	} catch (error) {
		return false;
	}
};

export default askBeforeDelete;
