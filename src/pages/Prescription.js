import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { requestCameraPermission } from '../utility/CameraPermission';

const Prescription = () => {
    const [avatar, setAvatar] = useState(null);
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
            res => {
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.errorCode) {
                    console.log('ImagePicker Error: ', res.errorMessage);
                } else {
                    const asset = res.assets[0]; // 선택한 첫 번째 이미지
                    setAvatar(asset.uri);
                    console.log('Selected image URI:', asset.uri);
                    navigation.navigate('PrescriptionScan', { avatar: asset.uri });
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // 부모 컨테이너에서 수직 중앙 정렬
        alignItems: 'center', // 부모 컨테이너에서 수평 중앙 정렬
        backgroundColor: 'white'
    },
    upper_section: {
        height: '75%',
        backgroundColor: '#F9F6F6',
        alignItems: 'center', // 수평 중앙 정렬
        justifyContent: 'center', // 수직 중앙 정렬
        width: '85%',
        borderRadius: 10,
        marginBottom: 20,
    },
    camera_img: {
        resizeMode: 'contain',
    },
    lower_section: {
        justifyContent: 'center', // lower_section 내부에서 수직 중앙 정렬
        alignItems: 'center', // lower_section 내부에서 수평 중앙 정렬
        width: '85%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#1967FF',
        marginBottom: 65,
    },
    text: {
        color: 'white', // 텍스트 색상을 흰색으로 설정
    }
});

export default Prescription;
