import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { requestCameraPermission } from '../utility/CameraPermission';

const Prescription = () => {
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ocrResponse, setOcrResponse] = useState(null);
    const navigation = useNavigation();

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
                includeBase64: true, // Base64 포함 여부
                quality: 1,
                selectionLimit: 1,
            },
            async (res) => {
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.errorCode) {
                    console.log('ImagePicker Error: ', res.errorMessage);
                } else {
                    const asset = res.assets[0]; // 선택한 첫 번째 이미지
                    setAvatar(asset.uri);
                    console.log('Selected image URI:', asset.uri);

                    // 로딩 상태 활성화
                    setLoading(true);

                    // OCR 요청
                    try {
                        const base64String = asset.base64;
                        if (!base64String) {
                            Alert.alert('이미지 데이터를 가져오는 데 실패했습니다.');
                            setLoading(false);
                            return;
                        }
                        console.log('base64String',base64String);

                        const apiUrl = 'https://0k79d5u57m.apigw.ntruss.com/custom/v1/32942/47df2c2257a32e0e122c289df9fd459772e2c9f523358fa32538d9748db50757/infer';
                        const secretKey = 'eWdXa3RpRm9KaWhHZldscmNLS05PUlp2SUZ4ZGF6S2Q=';

                        const headers = {
                            'Content-Type': 'application/json'
                        };

                        const body = {
                            "version": "V1",
                            "requestId": "test-request",
                            "timestamp": Date.now(),
                            "lang": "ko",
                            "images": [
                              {
                                "format": "jpg",
                                "name": "test 1",
                                "data": base64String
                              }
                            ]
                          };
                    

                        console.log("OCR request",body);
                        const ocrResponse = await axios.post(
                            apiUrl,
                            body,
                            {
                                headers,
                                auth: { username: secretKey, password: '' }
                            }
                        );
                        
                        const data = ocrResponse.data;

                        // 응답 데이터 저장
                        setOcrResponse(data);
                        console.log('OCR Response Data:', data);

                        // OCR 응답 후 페이지 전환
                        navigation.navigate('PrescriptionScan', { avatar: asset.uri });
                    } catch (error) {
                        console.error('Error processing the OCR request:', error);
                        Alert.alert('OCR 요청 처리 중 오류가 발생했습니다.');
                    } finally {
                        // 로딩 상태 비활성화
                        setLoading(false);
                    }
                }
            },
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.upper_section}>
                <Image style={styles.camera_img} source={require('../../assets/icon/camera.png')} />
            </View>
            <TouchableOpacity onPress={handleCamera} style={styles.lower_section}>
                <Text style={styles.text}>처방전 스캔하기</Text>
            </TouchableOpacity>
            {loading && (
                <ActivityIndicator
                    size="large"
                    color="#1967FF"
                    style={styles.loader}
                />
            )}
            {ocrResponse && (
                <View style={styles.responseContainer}>
                    <Text style={styles.responseText}>OCR Response:</Text>
                    <Text style={styles.responseData}>{JSON.stringify(ocrResponse, null, 2)}</Text>
                </View>
            )}
        </View>
    )
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
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -25,
        marginLeft: -25,
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
