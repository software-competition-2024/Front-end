import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User } from '../API/User';

const MyPage = () => {
    const navigation = useNavigation();
    const [profile, setProfile] = useState({
        email: null,
        password: null,
        nickname: null
    });

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const profileData = await User();
            //한번더 확인
            setProfile(profileData.data);
          } catch (error) {
            console.error('회원 정보 조회 에러:', error);
            Alert.alert('회원 정보 조회 실패', '서버와 통신하는 중 오류가 발생했습니다.');
          }
        };
    
        fetchProfile();
      }, []);

    return (
        <View style={styles.container}>
            <View style={styles.user_info}>
                <Image style={styles.my_profile} source={require('../../assets/icon/profile.png')} />
                <Text style={styles.Text}>{profile.nickname}</Text>
                <Text style={styles.Text}>{profile.email}</Text>
            </View>
            <View style={styles.menu_section}>
                <View style={styles.upper_section}>
                    <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('MyInfo')}>
                        <Image style={{ width: 40, height: 50 }} source={require('../../assets/icon/myinfo.png')} />
                        <Text style={styles.text}>My Info</Text>
                    </TouchableOpacity>
                    <View style={styles.section1}>
                        <Image style={{ width: 48, height: 50 }} source={require('../../assets/icon/how_to_use.png')} />
                        <Text style={styles.text}>How To Use</Text>
                    </View>
                </View>
                <View style={styles.lower_section}>
                    <View style={styles.section}>
                        <Image style={{ width: 50, height: 50, marginTop: 20 }} source={require('../../assets/icon/setting.png')} />
                        <Text style={styles.text}>Settings</Text>
                    </View>
                    <View style={styles.section2}>
                        <Image style={{ width: 49, height: 48, marginRight: 25, marginTop: 20 }} source={require('../../assets/icon/notice.png')} />
                        <Text style={styles.text}>Notion</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    user_info: {
        backgroundColor: '#7273AA',
        borderRadius: 30,
        alignItems: 'center',
        marginHorizontal: 60,
        marginVertical: 60,
        paddingBottom: 30,
    },
    my_profile: {
        marginVertical: 30,
    },
    Text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    menu_section: {
        alignItems: 'center',
        flex: 1,
    },
    upper_section: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 0.8,
    },
    lower_section: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },
    section: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    section1: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 0.8,
        paddingLeft: 15, // Adjusted padding to match section2
    },
    section2: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 0.8,
        paddingLeft: 40, // Adjusted padding to match section1
    },
    text: {
        color: '#1F2178',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
    },
    text1: {
        color: '#1F2178',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text2: {
        color: '#1F2178',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default MyPage;
