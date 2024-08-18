import React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicineDetail = ({}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item} = route.params; //mockMedicine을 route에서 받아옴
  const [medicineDetail, setMedicineDetail] = useState(null);

  // mockMedicine 데이터를 컴포넌트 내부에 정의
  const mockMedicine = [
    {
      id: 1,
      name: '트라울점160mg',
      notion: '해열진통제로열을 내리고 통증을\n 밀폐유기 줄여줍니다.',
      alert: '[기타 진통제]',
    },
    {
      id: 2,
      name: '페니라민정',
      notion: '항히스타민제:알레르기 질환, \n 감기,가려움 증상 완화',
      alert: '[항히스타민 & 향알러지약]',
    },
    {
      id: 3,
      name: '에시폴엔산',
      notion: '정장제로 장내 균총의 정상화를 \n 장질환율 개선하여 줍니다.',
      alert: '[정장제]',
    },
    {
      id: 4,
      name: '푸리노신시럽',
      notion: '광범위한 항바이러스제',
      alert: '[항바이러스제]',
    },
    {
      id: 5,
      name: '소론토칭',
      notion: '부산 픽셀호르몬제, 만성염증, \n 피부질환 기침 알러지 질환 등',
      alert: '[부신피질호르몬]',
    },
    {
      id: 6,
      name: '알게나점',
      notion: '제산제',
      alert: '[제산제 & 흡착제 ]',
    },
    {
      id: 7,
      name: '택시부편시럽',
      notion: '비스테로이드성소염진통 및 해열제',
      alert: '[비스테로이드성 소염진통제]',
    },
  ];

  // 약품 상세 정보를 가져오는 함수
  const fetchMedicineDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found, redirecting to login.');
        navigation.replace('LoginPage');
        return;
      }

      const endpoint =
        item.type === 'prescription'
          ? `/home/${item.id}/prescription`
          : `/home/${item.id}/over_the_counter`;

      const response = await fetch(`http://10.0.2.2:8080${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const result = await response.json();

        if (item.type === 'prescription') {
          // 처방약일 경우 API 데이터와 mockMedicine 병합
          setMedicineDetail({
            ...result,
            mockMedicine: mockMedicine, // mockMedicine 데이터가 있다면 포함
          });
        } else {
          setMedicineDetail(result);
        }
      } else {
        console.error('Failed to fetch medicine details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    }
  };

  const deleteMedicine = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found, redirecting to login.');
        navigation.replace('LoginPage');
        return;
      }
      const endpoint =
        item.type === 'prescription'
          ? `/home/${item.id}/prescription`
          : `/home/${item.id}/over_the_counter`;

      const response = await fetch(`http://10.0.2.2:8080${endpoint}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const result = await response.text();
        console.log('Delete result:', result);
        alert('약품이 성공적으로 삭제되었습니다.');

        // Home 화면으로 navigate할 때 삭제된 약품 ID를 전달
        navigation.navigate('Home', {deletedId: item.id});
      } else {
        console.error('Failed to delete medicine:', response.status);
        alert('약품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  useEffect(() => {
    fetchMedicineDetail();
  }, []);

  if (!medicineDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  // 디버깅을 위한 로그 추가
  console.log('medicineDetail:', medicineDetail);

  // 이미지 경로 설정
  let imageSource;
  if (item.medicineName.includes('타이')) {
    imageSource = require('../../assets/image/tylenol.png');
  } else if (item.medicineName.includes('후시')) {
    imageSource = require('../../assets/image/fushidin.png');
  } else if (item.medicineName.includes('시크릿')) {
    imageSource = require('../../assets/image/secretone.png');
  } else if (item.medicineName.includes('마데')) {
    imageSource = require('../../assets/image/madecasol.png');
  } else if (item.medicineName.includes('파모')) {
    imageSource = require('../../assets/image/famotidine.png');
  } else if (item.medicineType === '처방약') {
    imageSource = require('../../assets/image/prescription.jpg'); // 기본 플레이스홀더 이미지
  } else {
    imageSource = require('../../assets/icon/placeholder.png');
  }

  const PrescriptionDetailComponent = () => (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>
            {medicineDetail.medicineName || medicineDetail.productName}
          </Text>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <Text style={styles.sectionTitle}>남은 사용기한</Text>
          <Text style={styles.dDay}>{medicineDetail.expirationDate}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>사용기한</Text>
              <Text style={styles.dateValue}>
                {medicineDetail.expirationDate}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>처방날짜</Text>
              <Text style={styles.dateValue}>
                {medicineDetail.prescriptionDate}
              </Text>
            </View>
          </View>
          {/* 약정보 섹션 */}
          <View style={styles.about_medicine}>
            <Text style={styles.medicine_text}>약정보</Text>
            {medicineDetail.mockMedicine &&
            medicineDetail.mockMedicine.length > 0 ? (
              medicineDetail.mockMedicine.map(item => (
                <View key={item.id} style={styles.medicineCard}>
                  <Text style={styles.medicine_name}>{item.name}</Text>
                  <View style={styles.medicineContent}>
                    <Image
                      source={require('../../assets/icon/medicine_img.png')} // 약 이미지 경로 설정
                      style={styles.medicineImage}
                    />
                    <View style={styles.medicineTextContainer}>
                      <Text style={[styles.medicineText, {marginBottom: 8}]}>
                        <Text style={{fontWeight: 'bold', color: '#1F2178'}}>
                          복약안내:
                        </Text>{' '}
                        {item.notion}
                      </Text>
                      <Text style={[styles.medicineText, {marginBottom: 5}]}>
                        <Text style={{fontWeight: 'bold', color: '#1F2178'}}>
                          주의사항:
                        </Text>{' '}
                        {item.alert}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.medicine_text}>약정보가 없습니다.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.deleteButton} onPress={deleteMedicine}>
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );
  const OTCDetailComponent = () => (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>
            {medicineDetail.medicineName || medicineDetail.productName}
          </Text>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <Text style={styles.sectionTitle}>남은 사용기한</Text>
          <Text style={styles.dDay}>{medicineDetail.expirationDays}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>사용기한</Text>
              <Text style={styles.dateValue}>
                {medicineDetail.expirationDate}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>구입날짜</Text>
              <Text style={styles.dateValue}>
                {medicineDetail.openingDate || medicineDetail.prescriptionDate}
              </Text>
            </View>
          </View>
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>성분</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>
                {medicineDetail.ingredients || '정보가 없습니다.'}
              </Text>
            </View>
            <Text style={styles.notesLabel}>복약안내</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>
                {medicineDetail.dosage || '정보가 없습니다.'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.deleteButton} onPress={deleteMedicine}>
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return item.type === 'prescription' ? (
    <PrescriptionDetailComponent />
  ) : (
    <OTCDetailComponent />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2178',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  image: {
    width: 200,
    height: 100,
    backgroundColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#1F2178',
  },
  dDay: {
    fontSize: 24,
    color: '#1967FF',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateSection: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateValue: {
    fontSize: 16,
    marginStart: 10,
    fontWeight: 'bold',
  },
  about_medicine: {
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  medicine_text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 7,
    marginBottom: 10,
  },
  medicineCard: {
    marginBottom: 10,
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: '#1F2178',
    paddingHorizontal: 8,
    paddingVertical: 5,
    width: 350,
    alignSelf: 'center', // 수평 가운데 정렬
    backgroundColor: 'white', // 배경색 추가
  },
  medicine_name: {
    fontSize: 12,
    color: '#1F2178',
    fontWeight: 'bold',
  },
  medicineContent: {
    flexDirection: 'row',
    alignItems: 'center', // 수직 가운데 정렬
  },
  medicineImage: {
    width: 80, // 이미지 크기 설정
    height: 50,
  },
  medicineTextContainer: {
    marginLeft: 10,
  },
  medicineText: {
    fontSize: 12,
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    color: '#1F2178',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#1F2178',
    borderRadius: 10,
    marginBottom: 20,
  },
  notesText: {
    fontSize: 14,
    margin: 10,
  },
  deleteButton: {
    width: 80,
    backgroundColor: '#E33131',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 13,
  },
});

export default MedicineDetail;
