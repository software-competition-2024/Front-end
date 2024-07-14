import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const StartPage = () => {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.replace('MainScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon/medimate_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>
          의약품 사용기한 알림 서비스 {'\n'}
          MediMate 시작합니다!
        </Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
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
    backgroundColor: '#ccc', // 로고가 없을 경우 회색 네모로 표시
    marginBottom: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#525252',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#1F2178',
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    position: 'absolute',
    bottom: 25,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StartPage;
