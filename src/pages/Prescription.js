import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { requestCameraPermission } from '../utility/CameraPermission';

const Prescription = () => {
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ocrResponse, setOcrResponse] = useState(null);
    const navigation = useNavigation();

    const handleImagePicker = async () => {
        const options = {
            title: '사진 선택',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        Alert.alert(
            '사진 선택',
            '이미지를 선택하거나 카메라를 사용할 수 있습니다.',
            [
                {
                    text: '카메라',
                    onPress: () => handleCamera(),
                },
                {
                    text: '갤러리',
                    onPress: () => handleGallery(),
                },
                {
                    text: '취소',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

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
                includeBase64: true,
                quality: 1,
                selectionLimit: 1,
            },
            (res) => processImageResponse(res)
        );
    };

    const handleGallery = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 512,
                maxHeight: 512,
                includeBase64: true,
                quality: 1,
                selectionLimit: 1,
            },
            (res) => processImageResponse(res)
        );
    };

    const processImageResponse = async (res) => {
        if (res.didCancel) {
            console.log('User cancelled image picker');
        } else if (res.errorCode) {
            console.log('ImagePicker Error: ', res.errorMessage);
        } else {
            const asset = res.assets[0];
            setAvatar(asset.uri);
            const base64String = asset.base64;
            console.log('Selected image base64:', base64String);

            // 로딩 상태 활성화
            setLoading(true);

            // OCR 요청
            PrescriptionOCR(base64String);
        }
    };

    const PrescriptionOCR = async (base64String) => {
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
                            url: null
                        }
                    ],
                    lang: 'ko',
                    requestId: 'string',
                    resultType: 'string',
                    timestamp: new Date().getTime(),
                    version: 'V1'
                },
                {
                    headers: {
                        'X-OCR-SECRET': secretKey
                    }
                }
            );

            const data = response.data;

            // 응답 데이터 저장
            setOcrResponse(data);
            console.log('OCR Response Data:', data);

            // OCR 응답 후 페이지 전환
            navigation.navigate('PrescriptionScan', { avatar: avatar, data: data });
        } catch (error) {
            console.error('Error processing the OCR request:', error);
            Alert.alert('OCR 요청 처리 중 오류가 발생했습니다.');
        } finally {
            // 로딩 상태 비활성화
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.upper_section}>
                <Image style={styles.camera_img} source={require('../../assets/icon/camera.png')} />
            </View>
            <TouchableOpacity onPress={handleImagePicker} style={styles.lower_section}>
                <Text style={styles.text}>처방전 스캔하기</Text>
            </TouchableOpacity>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#1967FF"
                        style={styles.loader}
                    />
                    <Text style={styles.loadingText}>처방전을 스캔중입니다...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // 로딩 중 배경색 화이트
    },
    loader: {
        marginBottom: 10, // 텍스트와 로딩 인디케이터 사이에 여백 추가
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
    },
    responseContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
    },
    responseText: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    responseData: {
        fontSize: 12,
        color: '#333',
    }
});

export default Prescription;
