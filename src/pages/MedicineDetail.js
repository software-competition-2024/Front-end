import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MedicineDetail = ({route}) => {
  const {item} = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{item.name}</Text>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/icon/placeholder.png')}
              style={styles.image}
            />
          </View>
          <Text style={styles.sectionTitle}>남은 사용기한</Text>
          <Text style={styles.dDay}>{item.dDay}</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>사용기한</Text>
              <Text style={styles.dateValue}>2029.03.07</Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>
                {item.type === '상비약' ? '구입날짜' : '처방날짜'}
              </Text>
              <Text style={styles.dateValue}>2024.05.01</Text>
            </View>
          </View>
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>복약안내</Text>
            <View style={styles.notesBox} />
            <Text style={styles.notesLabel}>주의사항</Text>
            <View style={styles.notesBox} />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.deleteButton}>
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
