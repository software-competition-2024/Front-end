import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from './Axios';

//상비약 등록
export const AddMedicine = async (request) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await instance.post(
            '/api/otc-medicines', 
            request, //객체 형태의 request전달하기
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        console.log('상비약 등록 응답:', response.data); 
        return response.data;
    } catch (error) {
        console.error('상비약 등록 에러:', error);
        throw error;
    }
};

//상비약 db정보 불러오기
export const GetMedicineDB = async (productName) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await instance.get(
            `/api/medicine-info/${productName}`, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        console.log('상비약 DB 조회 응답:', response.data); 
        return response.data;
    } catch (error) {
        console.error('상비약 DB 조회 에러:', error);
        throw error;
    }
};

//처방약 등록
export const AddPrescription = async (request) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await instance.get(
            '/api/pst-medicines', 
            request, //객체 형태의 request전달하기
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );
        console.log('처방약 등록 응답:', response.data); 
        return response.data;
    } catch (error) {
        console.error('처방약 등록 에러:', error);
        throw error;
    }
};