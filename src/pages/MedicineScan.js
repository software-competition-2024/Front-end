import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { format, add } from 'date-fns';
import DropDownPicker from 'react-native-dropdown-picker';
import { AddMedicine, GetMedicineDB } from '../API/Medicine';

const MedicineScan = ({ route }) => {
    const { avatar, productName } = route.params;
    const navigation = useNavigation();

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [medicineDB, setMedicineDB] = useState({});

    const [dropdown, setDropdown] = useState(false);
    const [value, setValue] = useState(1);
    const [expiryDate, setExpiryDate] = useState(new Date());

    const [request, setRequest] = useState({
        productName: null,
        expirationDate: format(new Date(), 'yyyy-MM-dd'), // Initial value formatted
        openingDate: format(new Date(), 'yyyy-MM-dd'), // Initial value formatted
        dosage: null,
        ingredients: null,
        classification: null,
        userEmail: null,
        pushNotificationSent: false
    });

    const [medicineImg, setMedicineImg] = useState('');

    // 이미지 선택 함수
    const selectMedicineImg = (productName) => {
        let src;
        if (productName.includes("타이")) {
            src = require('../../assets/image/tylenol.png');
        } else if (productName.includes("후시")) {
            src = require('../../assets/image/fushidin.png');
        } else if (productName.includes("시크릿")) {
            src = require('../../assets/image/secretone.png');
        } else if (productName.includes("마데")) {
            src = require('../../assets/image/madecasol.png');
        } else if (productName.includes("파모티딘")) {
            src = require('../../assets/image/famotidine.png');
        } else {
            src = null; 
        }
        setMedicineImg(src);
    };

    const onChange = (value) => {
        setValue(value);
    };

    const [items, setItems] = useState([
        { label: '알약', value: 1 },
        { label: '안약', value: 2 },
        { label: '연고', value: 3 },
    ]);

    const formattedDate = format(date, 'yyyy.MM.dd');
    const formattedExpiryDate = format(expiryDate, 'yyyy.MM.dd');

    //상비약 정보 조회
    useEffect(() => {
        const fetchMedicineData = async () => {
            try {
                const data = await GetMedicineDB(productName);
                console.log("응답받은 상비약 정보 확인1", data);
                setMedicineDB(data[0]); 
                selectMedicineImg(productName);
            } catch (error) {
                console.error('상비약 정보 조회 에러:', error);
            }
        };

        if (productName) {
            fetchMedicineData();
        }
    }, [productName]);

    useEffect(() => {
        let newExpiryDate;
        switch (value) {
            case 1:
                newExpiryDate = add(new Date(), { years: 3 });
                break;
            case 2:
                newExpiryDate = add(new Date(), { months: 1 });
                break;
            case 3:
                newExpiryDate = add(new Date(), { months: 6 });
                break;
            default:
                newExpiryDate = new Date();
                break;
        }
        setExpiryDate(newExpiryDate);
    }, [value]);

    const handleSubmit = () => {
        setRequest({
            productName: medicineDB.productName,
            expirationDate: format(expiryDate, 'yyyy-MM-dd').toString(), // Format the expiry date
            openingDate: format(date, 'yyyy-MM-dd').toString(), // Format the opening date
            dosage: medicineDB.dosage,
            ingredients: medicineDB.ingredients,
            classification: medicineDB.classification,
            userEmail: "", // 사용자 이메일을 어떻게 처리할지에 따라 설정
            pushNotificationSent: false
        });

        AddMedicine(request);
        navigation.navigate('Home');
    };

    return (
        <ScrollView contentContainerStyle={styles.headerContainer}>
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
            {medicineImg ? (
                <Image style={styles.image} source={medicineImg} />
            ) : (
                <Text>No image selected</Text>
            )}
            <View style={styles.info_container}>
                <View style={styles.info_item1}>
                    <Text style={styles.date_text}>개봉날짜</Text>
                    <View style={styles.date}>
                        <Text style={styles.dateText1}>{formattedDate}</Text>
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <Image style={styles.editIcon} source={require('../../assets/icon/edit.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.info_item2}>
                    <Text style={styles.date_text}>사용기한</Text>
                    <View style={styles.dropdown_section}>
                        <Text style={styles.dateText2}>{formattedExpiryDate}</Text>
                        <DropDownPicker
                            style={styles.dropdownpicker}
                            containerStyle={styles.dropdownContainer}
                            open={dropdown}
                            value={value}
                            items={items}
                            placeholder="전체"
                            setOpen={setDropdown}
                            setValue={setValue}
                            setItems={setItems}
                            onChangeValue={onChange}
                        />
                    </View>
                </View>
            </View>
            <Text style={styles.medicine_text}>약정보</Text>
            <View style={styles.about_medicine}>
                <View style={styles.medicine_section}>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>제품명</Text>
                        <Text style={{ marginTop: 10 }}>{medicineDB.productName || '정보 없음'}</Text>
                    </View>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>성분</Text>
                        <Text style={{ marginTop: 10 }}>{medicineDB.ingredients || '정보 없음'}</Text>
                    </View>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>분류</Text>
                        <Text style={{ marginTop: 10 }}>{medicineDB.classification || '정보 없음'}</Text>
                    </View>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>용법 용량</Text>
                        <Text style={styles.dosageText}>
                            {medicineDB.dosage || '정보 없음'}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.done_btn_container}>
                <TouchableOpacity style={styles.done_btn} onPress={handleSubmit}>
                    <Text style={styles.done_btn_text}>완료</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    scan_text: {
        fontSize: 18,
        color: 'black',
        marginTop: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '100%',
        marginLeft: 25,
    },
    image: {
        width: '90%',
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
        alignItems: 'flex-start',
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
    dateText1: {
        marginLeft: 25,
        marginTop: 5,
    },
    dateText2: {
        marginTop: 5,
    },
    editIcon: {
        marginLeft: 5,
        marginTop: 8,
    },
    about_medicine: {
        alignItems: 'flex-start',
        width: '90%',
        paddingHorizontal: 20,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 50,
    },
    medicine_text: {
        marginTop: 20,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 10,
        textAlign: 'left',
        width: '90%',
    },
    medicineCard: {
        marginBottom: 10,
        borderWidth: 0.7,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
    },
    medicine_section: {
        marginTop: 10,
    },
    section1: {
        paddingBottom: 15,
    },
    medicine_key: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 15,
    },
    dosageText: {
        marginTop: 10,
    },
    done_btn_container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    done_btn: {
        fontSize: 15,
        backgroundColor: '#1967FF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        color: 'white',
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'flex-end',
        marginLeft: 310,
        width: '17%'
    },
    done_btn_text: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        width: '50%',
        marginTop: 10,
    },
});

export default MedicineScan;
