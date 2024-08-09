import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { requestCameraPermission } from '../utility/CameraPermission';
import axios from 'axios';

const Medicine = () => {
    const [avatar, setAvatar] = useState(null);
    const [productName, setProductName] = useState('');
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
                    MedicineOCR(base64String);
                }
            }
        );
    };

    const MedicineOCR = async (base64String) => {
        const apiUrl = 'https://hgi9up5kcs.apigw.ntruss.com/custom/v1/33225/4847702c2400f6a73455378634f106c09f1e73c1dc53bffd1d4a2d8cc26be056/general';
        const secretKey = 'Z2lteWJRZVRjdURneU1YcUlaQXBWSUN5SmlUQ3lhZ2g=';

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
                    timestamp: new Date().getTime(), // 타임스탬프를 밀리초로 전달
                    version: 'V1'
                },
                {
                    headers: {
                        'X-OCR-SECRET': secretKey
                    }
                }
            );

            const images = response.data.images;
            console.log("이미지정보", images)
            let foundTylenol = false;

            images.forEach(image => {
                image.fields.forEach(field => {
                    if (field.inferText.includes('타이레놀')) {
                        foundTylenol = true;
                        if(foundTylenol){
                            const productName = "타이레놀"
                            navigateToNext(productName);
                        }
                    }
                });
            });

            

            
        } catch (error) {
            console.log('Error in OCR request:', error.response?.data || error.message);
        }
    };

    const navigateToNext = (productName) => {
        if (productName) {
            console.log('Navigating to MedicineScan with productName:', productName);
            navigation.navigate('MedicineScan', {
                productName: productName,
                avatar: avatar
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.upper_section}>
                <Image style={styles.camera_img} source={require('../../assets/icon/camera.png')} />
            </View>
            <TouchableOpacity onPress={handleCamera} style={styles.lower_section}>
                <Text style={styles.text}>상비약 스캔하기</Text>
            </TouchableOpacity>
        </View>
    );
};

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
    }
});

export default Medicine;
