import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const NextSignUpStep = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () => {
    //회원가입 로직 추가
    navigation.replace('StartPage');
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
      <View style={styles.form}>
        <Text style={styles.label}>* 필수</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>* 필수</Text>
        <TextInput
          style={styles.input}
          placeholder="닉네임 입력"
          value={nickname}
          onChangeText={setNickname}
        />
        <Text style={styles.label}>* 필수</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.hint}>8자리 이상의 영어, 숫자로 만들어주세요.</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
        />
        <Text style={styles.hint}>
          {password &&
            passwordConfirm &&
            (password === passwordConfirm
              ? '비밀번호가 일치합니다.'
              : '비밀번호가 일치하지 않습니다.')}
        </Text>
      </View>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>회원가입 완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1F2178',
    paddingVertical: 18,
    alignItems: 'center',
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
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#1F2178',
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  hint: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 18,
    marginLeft: 10,
  },
  signUpButton: {
    backgroundColor: '#1F2178',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'bottom',
    marginHorizontal: 20,
    marginTop: 70,
    borderRadius: 20,
    marginBottom: 30,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NextSignUpStep;
