import React from 'react';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MedicineDetail = ({}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item} = route.params;
  const [medicineDetail, setMedicineDetail] = useState(null);

  // 약품 상세 정보를 가져오는 함수
  const fetchMedicineDetail = async () => {
    try {
      const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIxMjIyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcyMzk3NTgzMSwiZXhwIjoxNzIzOTc3NjMxfQ.-LWx1XMl4_IWp5YBVWc8q4Ut_xcXDrEn-zvFbhxQdLM";
      if (!token) {
        console.error('No JWT token found, redirecting to login.');
        navigation.replace('LoginPage');
        return;
      }

      const endpoint =
        item.type === 'prescription'
          ? `/home/${item.id}/prescription`
          : `/home/${item.id}/over_the_counter`;

      const response = await fetch(`http://192.168.45.81:8080${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        setMedicineDetail(result);
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

      const response = await fetch(`http://192.168.45.187:8080${endpoint}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const result = await response.text();
        console.log('Delete result:', result);
        alert('약품이 성공적으로 삭제되었습니다.');

        navigation.goBack(); // 삭제 후 이전 화면으로 이동
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>
            {medicineDetail.medicineName || medicineDetail.productName}
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/icon/placeholder.png')}
              style={styles.image}
            />
          </View>
          <Text style={styles.sectionTitle}>남은 사용기한</Text>
          <Text style={styles.dDay}>{medicineDetail.expirationDays}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>사용기한</Text>
              <Text style={styles.dateValue}>
                {medicineDetail.expirationDays}
              </Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>
                {item.type === '상비약' ? '구입날짜' : '처방날짜'}
              </Text>
              <Text style={styles.dateValue}>
                {medicineDetail.openingDate || medicineDetail.prescriptionDate}
              </Text>
            </View>
          </View>
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>
              {item.type === '상비약' ? '성분' : '복약안내'}
            </Text>
            <View style={styles.notesBox} />
            <Text style={styles.notesLabel}>
              {item.type === '상비약' ? '복약안내' : '주의사항'}
            </Text>
            <View style={styles.notesBox}>
              <Text>
                {medicineDetail.dosage ||
                  medicineDetail.precautions ||
                  '정보가 없습니다.'}
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
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  dDay: {
    fontSize: 24,
    color: '#1967FF',
    marginBottom: 20,
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
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  notesBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
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
