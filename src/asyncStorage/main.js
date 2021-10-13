import AsyncStorage from '@react-native-async-storage/async-storage';

export const key = {
  uid: 'uid',
};

export const setAsyncData = async (key, item) => {
  try {
    await AsyncStorage.setItem(key, item);
  } catch (error) {
    console.log(error);
  }
};

export const getAsyncData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return value;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteAsyncData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};
