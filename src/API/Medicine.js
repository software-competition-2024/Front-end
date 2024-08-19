import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from './Axios';

// 상비약 등록
export const AddMedicine = async request => {
  console.log('요청에 이용되는 request', request);
  const jwtToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIxMjIyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcyMzk3NTgzMSwiZXhwIjoxNzIzOTc3NjMxfQ.-LWx1XMl4_IWp5YBVWc8q4Ut_xcXDrEn-zvFbhxQdLM";
  console.log('jwtToken', jwtToken);
  try {
    if (!jwtToken) {
      throw new Error('JWT 토큰을 찾을 수 없습니다.');
    }

    const response = await instance.post(
      '/api/otc-medicines',
      request, // 객체 형태의 request 전달하기
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    console.log('상비약 등록 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('상비약 등록 에러:', error);
    throw error;
  }
};

//상비약 db정보 불러오기
export const GetMedicineDB = async productName => {
  try {
    const jwtToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIxMjIyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcyMzk3NTgzMSwiZXhwIjoxNzIzOTc3NjMxfQ.-LWx1XMl4_IWp5YBVWc8q4Ut_xcXDrEn-zvFbhxQdLM";
    const response = await instance.get(`/api/medicine-info/${productName}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log('상비약 DB 조회 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('상비약 DB 조회 에러:', error);
    throw error;
  }
};

//처방약 등록
export const AddPrescription = async request => {
  try {
    console.log("요청 정보", request)
    const jwtToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIxMjIyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcyMzk3NTgzMSwiZXhwIjoxNzIzOTc3NjMxfQ.-LWx1XMl4_IWp5YBVWc8q4Ut_xcXDrEn-zvFbhxQdLM";
    const response = await instance.post(
      '/api/pst-medicines',
      request, //객체 형태의 request전달하기
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    console.log('처방약 등록 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('처방약 등록 에러:', error);
    throw error;
  }
};
