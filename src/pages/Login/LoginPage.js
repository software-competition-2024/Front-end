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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.45.34:8080/login', {
        // 에뮬레이터에서는 10.0.2.2 사용
        email,
        password,
      });
      if (response.data.jwtToken) {
        // JWT 토큰 저장
        await AsyncStorage.setItem('jwtToken', response.data.jwtToken);

        // 자동 로그인 설정 저장
        await AsyncStorage.setItem('autoLogin', autoLogin.toString());

        // 메인 화면으로 이동
        navigation.replace('MainScreen');
      } else {
        alert('로그인에 실패했습니다.');
        console.log('Response data:', response.data);
      }
    } catch (error) {
      console.error('Error during login:', error);

      if (error.response) {
        alert('로그인 중 오류가 발생했습니다.');
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
  const toggleAutoLogin = () => {
    setAutoLogin(!autoLogin);
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon/medimate_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>MediMate</Text>
      </View>
      <TextInput
        style={styles.input}
        placehodler="이메일 입력 (ex. ~~~~ @ naver.com)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleAutoLogin}>
          <Image
            source={
              autoLogin
                ? require('../../../assets/icon/checkbox_checked.png')
                : require('../../../assets/icon/checkbox_unchecked.png')
            }
            style={styles.checkbox}
          />
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>자동 로그인</Text>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text>아직 회원이 아니라면?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpPage')}>
          <Text style={styles.signupText}>회원가입 하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomColor: '#1F2178',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#1F2178',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  signupText: {
    marginLeft: 5,
    color: '#1F2178',
    fontWeight: 'bold',
  },
});

export default LoginPage;
