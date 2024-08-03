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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NextSignUpStep = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('http://192.168.45.246:8080/register', {
        email,
        nickname,
        password,
      });

      alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
      navigation.replace('LoginPage'); // 회원가입 후 로그인 화면으로 이동
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          alert('이미 존재하는 이메일 주소입니다.');
        } else {
          alert('회원가입 중 오류가 발생했습니다.');
        }
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
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
