import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from './Axios';

export const User = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await instance.get(
            '/user', 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        console.log('회원정보 조회 응답:', response.data); 
        return response.data;
    } catch (error) {
        console.error('회원정보 조회 에러:', error);
        throw error;
    }
};