import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { requestCameraPermission } from '../utility/CameraPermission';
import axios from 'axios';
import Alram from '../component/Modal/Alram';

const Medicine = () => {
  const [avatar, setAvatar] = useState(null);
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigation = useNavigation();

  useEffect(() => {
    setProductName('');
  }, []);

  const handleCamera = async () => {
    const permission = await requestCameraPermission();
    if (!permission) {
      Alert.alert('카메라 권한이 필요합니다.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android' || Platform.OS === 'ios',
        quality: 1,
        selectionLimit: 1,
      },
      async res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.errorCode) {
          console.log('ImagePicker Error: ', res.errorMessage);
        } else {
          const asset = res.assets[0];
          setAvatar(asset.uri);
          const base64String = asset.base64;
          console.log('Selected image base64:', base64String);
          setLoading(true); // 로딩 시작
          MedicineOCR(base64String);
        }
      },
    );
  };

  const MedicineOCR = async base64String => {
    const apiUrl = '';
    const secretKey = '';

    try {
      const response = await axios.post(
        apiUrl,
        {
          images: [
            {
              format: 'jpg',
              name: 'medium',
              data: base64String,
              url: null,
            },
          ],
          lang: 'ko',
          requestId: 'string',
          resultType: 'string',
          timestamp: new Date().getTime(),
          version: 'V1',
        },
        {
          headers: {
            'X-OCR-SECRET': secretKey,
          },
        },
      );

      const images = response.data.images;
      console.log('이미지정보', images);
      let foundMedicine = false;

      images.forEach(image => {
        image.fields.forEach(field => {
          if (
            field.inferText.includes('타이') ||
            field.inferText.includes('레놀')
          ) {
            console.log('타이레놀');
            navigateToNext('타이레놀');
          } else if (field.inferText.includes('후시')) {
            console.log('후시딘');
            navigateToNext('후시딘');
          } else if (
            field.inferText.includes('마데') ||
            field.inferText.includes('카솔')
          ) {
            console.log('마데카솔');
            navigateToNext('마데카솔');
          } else if (
            field.inferText.includes('파모') ||
            field.inferText.includes('티딘')
          ) {
            console.log('파모티딘');
            navigateToNext('파모티딘');
          }
        });
      });
    } catch (error) {
      console.log(
        'Error in OCR request:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const navigateToNext = productName => {
    if (productName) {
      console.log('Navigating to MedicineScan with productName:', productName);
      navigation.navigate('MedicineScan', {
        productName: productName,
        avatar: avatar,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Alram />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1967FF" />
          <Text style={styles.loadingText}>스캔 중입니다...</Text>
        </View>
      ) : (
        <>
          <View style={styles.upper_section}>
            <Image
              style={styles.camera_img}
              source={require('../../assets/icon/camera.png')}
            />
          </View>
          <TouchableOpacity onPress={handleCamera} style={styles.lower_section}>
            <Text style={styles.text}>상비약 스캔하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  upper_section: {
    height: '75%',
    backgroundColor: '#F9F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    borderRadius: 10,
    marginBottom: 20,
  },
  camera_img: {
    resizeMode: 'contain',
  },
  lower_section: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1967FF',
    marginBottom: 65,
  },
  text: {
    color: 'white',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: '#1967FF',
    fontSize: 16,
  },
});

export default Medicine;
