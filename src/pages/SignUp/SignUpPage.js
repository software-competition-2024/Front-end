import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SignUpPage = () => {
  const navigation = useNavigation();
  const [agreements, setAgreements] = useState({
    all: false,
    personalInfo: false,
    age14: false,
    terms: false,
    marketing: false,
  });
  const toggleAgreement = key => {
    setAgreements(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const toggleAllAgreements = () => {
    const newState = !agreements.all;
    setAgreements({
      all: newState,
      personalInfo: newState,
      age14: newState,
      terms: newState,
      marketing: newState,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/icon/back_arrow.png')} // 백 버튼 이미지를 해당 경로에 맞게 수정하세요
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIGN UP</Text>
      </View>
      <Text style={styles.subHeader}>약관 동의 {'>'} 프로필 생성</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.agreementContainer}>
          <TouchableOpacity
            style={styles.agreementItem}
            onPress={toggleAllAgreements}>
            <Image
              source={
                agreements.all
                  ? require('../../../assets/icon/checkbox_checked.png')
                  : require('../../../assets/icon/checkbox_unchecked.png')
              }
              style={styles.checkbox}
            />
            <Text style={styles.agreementText}>약관 전체 동의</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('personalInfo')}>
            <Image
              source={
                agreements.personalInfo
                  ? require('../../../assets/icon/checkbox_checked.png')
                  : require('../../../assets/icon/checkbox_unchecked.png')
              }
              style={styles.checkbox}
            />
            <Text style={styles.agreementText}>
              <Text style={styles.required}>(필수)</Text> 개인 정보 수집 및 이용
              동의
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('age14')}>
            <Image
              source={
                agreements.age14
                  ? require('../../../assets/icon/checkbox_checked.png')
                  : require('../../../assets/icon/checkbox_unchecked.png')
              }
              style={styles.checkbox}
            />
            <Text style={styles.agreementText}>
              <Text style={styles.required}>(필수)</Text> 만 14세 이상입니다.
            </Text>
          </TouchableOpacity>
          <Text style={styles.subText}>
            만 14세 미만은 법적 대리인의 동의가 필요합니다.
          </Text>
          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('terms')}>
            <Image
              source={
                agreements.terms
                  ? require('../../../assets/icon/checkbox_checked.png')
                  : require('../../../assets/icon/checkbox_unchecked.png')
              }
              style={styles.checkbox}
            />
            <Text style={styles.agreementText}>
              <Text style={styles.required}>(필수)</Text> MediMate 이용 약관
              동의
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.agreementItem}
            onPress={() => toggleAgreement('marketing')}>
            <Image
              source={
                agreements.marketing
                  ? require('../../../assets/icon/checkbox_checked.png')
                  : require('../../../assets/icon/checkbox_unchecked.png')
              }
              style={styles.checkbox}
            />
            <Text style={styles.agreementText}>
              <Text style={styles.optional}>(선택)</Text> 마케팅 활용 및 광고성
              정보 수신 동의
            </Text>
          </TouchableOpacity>
          <Text style={styles.subText}>
            다양한 이벤트 및 MediMate의 소식을 빠르게 받아볼 수 있습니다.
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('NextSignUpStep')}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  backButtonImage: {
    width: 32,
    height: 32,
    tintColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1F2178',
    paddingVertical: 18,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    textAlign: 'center',
    marginVertical: 30,
    fontSize: 15,
    color: '#525252',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  agreementContainer: {
    borderWidth: 3,
    borderColor: '#1F2178',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  agreementText: {
    fontSize: 16,
    color: '#525252',
  },
  detailsLink: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'right',
  },
  subText: {
    fontSize: 10,
    color: '#999999',
    marginLeft: 34, // Checkbox width (24) + marginRight (10)
    marginBottom: 10,
  },
  required: {
    color: '#1967FF',
    fontWeight: 'bold',
  },
  optional: {
    color: '#999999',
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F2178',
    marginVertical: 5,
  },
  nextButton: {
    backgroundColor: '#1F2178',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 25,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpPage;
