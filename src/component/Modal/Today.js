import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

const Today = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>오늘의 복약안내</Text>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>처방전약</Text>
                <View style={styles.boxContainer}>
                  <View style={styles.horizontalContainer}>
                    <Text style={styles.medicineText}>아침 점심 저녁</Text>
                    <Text style={styles.expirationText}>식후 30분 </Text>
                  </View>
                  <Image 
                    style={styles.imageStyle} 
                    source={require("../../../assets/icon/medicine_img.png")}
                  />
                </View>
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.modalButtonContainer1}>
                  <Text style={styles.modalButton}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}
                  style={styles.modalButtonContainer2}>
                  <Text onPress={onClose} style={styles.modalButton}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderColor: '#1967FF',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 17,
    color: 'black',
    marginTop: 7,
  },
  section: {
    alignItems: 'center', // 중앙 정렬
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 15, // 글씨 크기 키움
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  boxContainer: {
    borderRadius: 5, // 박스의 모서리를 둥글게 설정
    borderColor: '#CCCCCC',
    borderWidth: 1,
    padding: 10, // 박스 내부 여백
    backgroundColor: '#F9F9F9', // 배경색 설정 (선택 사항)
    marginBottom: 15, // 박스 간의 간격
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineText: {
    marginRight: 5, // 간격 조정
    fontSize: 14,
  },
  expirationText: {
    color: 'red',
    fontSize: 15,
  },
  imageStyle: {
    width: '45%', 
    height: undefined,
    aspectRatio: 1, // 원본 비율 유지
    resizeMode: 'contain', // 이미지의 원본 비율 유지하면서 크기 조정
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
    borderTopColor: '#CCCCCC',
    borderTopWidth: 1,
  },
  modalButtonContainer1: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 5,
    borderRightColor: '#CCCCCC',
    borderRightWidth: 1,
  },
  modalButtonContainer2: {
    width: '50%',
    alignItems: 'center',
    paddingTop: 15,
  },
  modalButton: {
    fontSize: 16,
    color: 'black',
  },
});

export default Today;
