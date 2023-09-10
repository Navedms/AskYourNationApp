import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";

const prefix = 'cache';
const expiryInHours = 4;

const store = async (key, value) => {
    try {

        const item = {
            value,
            timestap: Date.now()
        }
        await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
    } catch (error) {
        console.log(error);
    }
}

const isExpired = (item) => {
    const now = dayjs();
    const storedTime = dayjs(item.timestamp);
    return now.diff(storedTime, "hour") > expiryInHours;
};

const get = async (key) => {
    try {
        const value = await AsyncStorage.getItem(prefix + key);
        const item = JSON.parse(value);

        if (!item) return null;

        if (isExpired(item)) {
            await AsyncStorage.removeItem(prefix + key);
            return null;
        }

        return item.value;

    } catch (error) {
        console.log(error);
    }
}

export default {
    store,
    get,
}