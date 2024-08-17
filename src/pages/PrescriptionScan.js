import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { format, addYears, parseISO } from 'date-fns';
import DatePicker from 'react-native-date-picker';
import AlramSetting from '../component/Modal/AlramSetting';
import { AddPrescription } from '../API/Medicine';

const PrescriptionScan = ({ route }) => {
    const { avatar, data } = route.params;
    const navigation = useNavigation();

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const formattedDate = format(date, 'yyyy.MM.dd');
    const [alramvisible, setAlramVisible] = useState(false);
    console.log("처방전 data", JSON.stringify(data.images, null, 2));

    // 처방약 등록하기 위한 정보
    const [request, setRequest] = useState({
        //"id":3,
        "medicineName": "처방전약",
        //"expirationDays": "D-180",
        "expirationDate": "2024-12-31",
        "prescriptionDate": "2024-07-13",
        "dosageInstruction": "식후 30분이내",
        "precautions": "걍먹어",
        //"expirationDaysInNumber": 180,
        "userEmail": "user@example.com",
        "pushNotification": false,
        "dosageNotification": false
    });

    // 데이터 파싱 및 상태 업데이트
    useEffect(() => {
        if (data && data.images && data.images.length > 0) {
            const parsedData = {
                medicineName: "",
                expirationDate: "",
                dosageInstruction: ""
            };

            data.images[0].fields.forEach(field => {
                if (field.name === "약품명") {
                    parsedData.medicineName = field.inferText;
                }
                if (field.name === "복약안내") {
                    parsedData.dosageInstruction = field.inferText;
                }
                if (field.name === "조제일자") {
                    // "조제일자: " 부분을 제거하고 나머지 부분만 추출
                    const dateStr = field.inferText.replace("조제일자 : ", "").trim();
                    console.log("날짜", dateStr);
                    parsedData.prescriptionDate = dateStr;
                }
            });

            // Calculate expiration date: one year after prescription date
            const prescriptionDateObj = parseISO(parsedData.prescriptionDate);
            const expirationDateObj = addYears(prescriptionDateObj, 1);
            const formattedExpirationDate = format(expirationDateObj, 'yyyy-MM-dd');

            setRequest(prevRequest => ({
                ...prevRequest,
                prescriptionDate: parsedData.prescriptionDate,
                expirationDate: formattedExpirationDate, // Set expiration date
            }));
        }
    }, [data]);


    console.log(request)

    const mockMedicine = [
        {
            id: 1,
            name: "트라울점160mg",
            notion: "해열진통제로열을 내리고 통증을\n 밀폐유기 줄여줍니다.",
            alert: "[기타 진통제]"
        },
        {
            id: 2,
            name: "페니라민정",
            notion: "항히스타민제:알레르기 질환, \n 감기,가려움 증상 완화",
            alert: "[항히스타민 & 향알러지약]"
        },
        {
            id: 3,
            name: "에시폴엔산",
            notion: "정장제로 장내 균총의 정상화를 \n 장질환율 개선하여 줍니다.",
            alert: "[정장제]"
        },
        {
            id: 4,
            name: "푸리노신시럽",
            notion: "광범위한 항바이러스제",
            alert: "[항바이러스제]"
        },
        {
            id: 5,
            name: "소론토칭",
            notion: "부산 픽셀호르몬제, 만성염증, \n 피부질환 기침 알러지 질환 등",
            alert: "[부신피질호르몬]"
        },
        {
            id: 6,
            name: "알게나점",
            notion: "제산제",
            alert: "[제산제 & 흡착제 ]"
        },
        {
            id: 7,
            name: "택시부편시럽",
            notion: "비스테로이드성소염진통 및 해열제",
            alert: "[비스테로이드성 소염진통제]"
        },
    ];

    // 처방약 등록하기
    const handleSubmit = () => {
        console.log("request", request);
        AddPrescription(request);
        navigation.navigate('Home');
    };

    const renderItem = ({ item }) => (
        <View style={styles.medicineCard}>
            <Text style={styles.medicineName}>{item.name}</Text>
            <View style={styles.medicineContent}>
                <Image source={require('../../assets/icon/medicine_img.png')} style={styles.medicineImage} />
                <View style={styles.medicineTextContainer}>
                    <Text>복약안내: {item.notion}</Text>
                    <Text>{item.alert}</Text>
                </View>
            </View>
        </View>
    );

    const ListHeaderComponent = () => (
        <View style={styles.headerContainer}>
            <AlramSetting visible={alramvisible} onClose={() => setAlramVisible(false)} />
            {open && (
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    onConfirm={(selectedDate) => {
                        setOpen(false);
                        setDate(selectedDate);
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            )}
            <Text style={styles.scan_text}>스캔정보</Text>
            {avatar ? (
                <Image style={styles.image} source={{ uri: avatar }} />
            ) : (
                <Image style={styles.image} source={require('../../assets/image/prescription.jpg')} />
            )}
            <View style={styles.info_container}>
                <View style={styles.info_item1}>
                    <Text style={styles.date_text}>처방날짜</Text>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>
                            {request.prescriptionDate}
                        </Text>
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <Image style={styles.editIcon} source={require('../../assets/icon/edit.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.info_item2}>
                    <Text style={styles.date_text}>사용기한</Text>
                    <Text style={styles.dateText}>{request.expirationDate}</Text>
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
                        onPress={() => setAlramVisible(true)}
                    />
                    <Text style={{ marginLeft: 65 }}>(선택) 복약 알림을 받으시겠습니까?</Text>
                    <Text onPress={handleSubmit} style={styles.done_btn}>완료</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    flatListContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
        paddingBottom: 20,
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
