import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const StepperInput = ({ value, onChange }) => {
  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) { // 값이 0보다 클 때만 감소
      onChange(value - 1);
    }
  };

  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity onPress={handleDecrement} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={String(value)}
        keyboardType="numeric"
        onChangeText={(text) => {
          const num = parseInt(text, 10);
          if (!isNaN(num)) {
            onChange(num);
          }
        }}
      />
      <TouchableOpacity onPress={handleIncrement} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const AlramSetting = ({ visible, onClose }) => {
  const [doseDays, setDoseDays] = useState(0);

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
              <Text style={styles.modalTitle}>알림 설정하기</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputSection}>
                  <Text style={styles.modalSubTitle}>복약일수</Text>
                  <StepperInput value={doseDays} onChange={setDoseDays} />
                </View>
                <View style={styles.inputSection}>
                  <Text style={styles.modalSubTitle}>복약시기</Text>
                  <BouncyCheckbox
                    style={styles.checkbox}
                    size={17}
                    fillColor="blue"
                    unFillColor="transparent"
                    iconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    innerIconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    textStyle={styles.checkboxText}
                    text='아침'
                  />
                  <BouncyCheckbox
                    style={styles.checkbox}
                    size={17}
                    fillColor="blue"
                    unFillColor="transparent"
                    iconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    innerIconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    textStyle={styles.checkboxText}
                    text='점심'
                  />
                  <BouncyCheckbox
                    style={styles.checkbox}
                    size={17}
                    fillColor="blue"
                    unFillColor="transparent"
                    iconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    innerIconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    textStyle={styles.checkboxText}
                    text='저녁'
                  />
                </View>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.modalButtonContainer1}>
                  <Text style={styles.modalButton}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonContainer2}>
                  <Text onPress={onClose} style={styles.modalButton}>완료</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 17,
    color: 'black',
    marginTop: 7,
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row', // 가로 배치
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 15,
  },
  inputSection: {
    width: '45%', // 각 섹션의 너비
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 숫자를 중앙에 배치
    width: '100%',
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
  input: {
    height: 38,
    width: 40, // 고정 너비로 중앙 정렬 유지
    borderRadius: 10,
    paddingLeft: 15,
    textAlign: 'center', // 숫자 중앙 정렬
    fontSize: 14,
    marginLeft: 4,
    marginRight: 14
  },
  checkbox: {
    marginBottom: 10,
  },
  checkboxText: {
    textDecorationLine: 'none', // 텍스트 전체 보기
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

export default AlramSetting;
