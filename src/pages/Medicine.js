import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { requestCameraPermission } from '../utility/CameraPermission';

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
            async res => {  // 비동기 콜백 함수
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.errorCode) {
                    console.log('ImagePicker Error: ', res.errorMessage);
                } else {
                    const asset = res.assets[0]; // 선택한 첫 번째 이미지
                    setAvatar(asset.uri);
                    console.log('Selected image URI:', asset.uri);

                    // 임시로 productName을 설정
                    setProductName("타이레놀");
                    navigateToNext(productName);
                }
            }
        );
    };

    const navigateToNext = (productName) => {
        while (productName) {
            if (productName) { // 조건을 적절하게 설정해야 합니다
                console.log("Navigating to MedicineScan with productName:", productName);
                navigation.navigate("MedicineScan", {
                    productName: productName,
                    avatar: avatar
                });
            }  
            break;
        }
    }


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
