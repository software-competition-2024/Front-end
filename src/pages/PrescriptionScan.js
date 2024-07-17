import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const PrescriptionScan = ({ route }) => {
    const { avatar } = route.params;
    const navigation = useNavigation();

    const mockMedicine = [
        {
            id: 1,
            name: "푸링정",
            notion: "식사 1시간 전에 복용하세요",
            alert: "공복에 복용하지 마세요"
        },
        {
            id: 2,
            name: "타진서방정",
            notion: "식사 1시간 전에 복용하세요",
            alert: "공복에 복용하지 마세요"
        },
        {
            id: 3,
            name: "푸링정",
            notion: "식사 1시간 전에 복용하세요",
            alert: "공복에 복용하지 마세요"
        },
        {
            id: 4,
            name: "타진서방전",
            notion: "식사 1시간 전에 복용하세요",
            alert: "공복에 복용하지 마세요"
        }
    ];

    const renderItem = ({ item }) => (
        <View style={styles.medicineCard}>
            <Text style={styles.medicineName}>{item.name}</Text>
            <View style={styles.medicineContent}>
                <Image source={require('../../assets/icon/medicine_img.png')} style={styles.medicineImage} />
                <View style={styles.medicineTextContainer}>
                    <Text>복약안내: {item.notion}</Text>
                    <Text>주의사항: {item.alert}</Text>
                </View>
            </View>
        </View>
    );

    const ListHeaderComponent = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.scan_text}>스캔정보</Text>
            {avatar ? (
                <Image style={styles.image} source={{ uri: avatar }} />
            ) : (
                <Text>No image selected</Text>
            )}
            <View style={styles.info_container}>
                <View style={styles.info_item1}>
                    <Text style={styles.date_text}>처방날짜</Text>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>2020.03.12</Text>
                        <TouchableOpacity onPress={() => alert("날짜 변경")}>
                            <Image style={styles.editIcon} source={require('../../assets/icon/edit.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.info_item2}>
                    <Text style={styles.date_text}>사용기한</Text>
                    <Text style={styles.dateText}>2020.03.12</Text>
                </View>
            </View>
            <View style={styles.about_medicine}>
                <Text style={styles.medicine_text}>약정보</Text>
            </View>
        </View>
    );

    return (
        <FlatList
            data={mockMedicine}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.flatListContainer}
            ListFooterComponent={
                <View style={styles.alertContainer}>
                    <BouncyCheckbox
                        style={styles.checkbox}
                        size={17}
                        fillColor="blue"
                        unFillColor="transparent"
                        iconStyle={{ borderColor: 'black', borderRadius: 0 }}
                        innerIconStyle={{ borderColor: 'black', borderRadius: 0 }}
                    />
                    <Text style={{marginLeft: 65}}>(선택) 복약 알림을 받으시겠습니까?</Text>
                    <Text onPress={() => navigation.navigate('Home')} style={styles.done_btn}>완료</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    flatListContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingBottom: 20,  // 스크롤 뷰의 하단에 여백 추가
    },
    headerContainer: {
        alignItems: 'center',
    },
    scan_text: {
        fontSize: 18,
        color: 'black',
        marginVertical: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '100%',
        marginLeft: 25,
    },
    checkbox: {
        position: 'absolute',
        top: 0,
        left: 40,
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    info_container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 20,
    },
    info_item1: {
        alignItems: 'center',
    },
    info_item2: {
        alignItems: 'center',
        marginLeft: 80,
    },
    date_text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    date: {
        flexDirection: "row",
        width: '100%',
    },
    dateText: {
        marginLeft: 25,
        marginTop: 5,
    },
    editIcon: {
        marginLeft: 5,
        marginTop: 8,
    },
    about_medicine: {
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 5,
    },
    medicine_text: {
        marginTop: 20,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    medicineCard: {
        marginBottom: 10,
        borderWidth: 0.7,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 350,
        alignSelf: 'center',  // 수평 가운데 정렬
        backgroundColor: 'white',  // 배경색 추가
    },
    medicineName: {
        fontSize: 14,
        color: 'black',
    },
    medicineContent: {
        flexDirection: 'row',
        alignItems: 'center',  // 수직 가운데 정렬
    },
    medicineImage: {
        width: 50,  // 이미지 크기 설정
        height: 50,
    },
    medicineTextContainer: {
        marginLeft: 10,
    },
    alertContainer: {
        marginTop: 20,
    },
    done_btn: {
        fontSize: 15,
        backgroundColor: '#1967FF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        color: 'white',
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'flex-end',
        marginLeft: 310,
        width: '17%'
    }
});

export default PrescriptionScan;
