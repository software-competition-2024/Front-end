import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { format, add } from 'date-fns';
import DropDownPicker from 'react-native-dropdown-picker';

const MedicineScan = ({ route }) => {
    const { avatar } = route.params;
    const navigation = useNavigation();

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const [dropdown, setDropdown] = useState(false);
    const [value, setValue] = useState(1);
    const [expiryDate, setExpiryDate] = useState(new Date());

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
            {avatar ? (
                <Image style={styles.image} source={{ uri: avatar }} />
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
                        <Text style={{ marginTop: 10 }}>타이레놀정 500mg</Text>
                    </View>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>성분</Text>
                        <Text style={{ marginTop: 10 }}>아세트아미노펜 500mg</Text>
                    </View>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>분류</Text>
                        <Text style={{ marginTop: 10 }}>해열, 진통, 소염제</Text>
                    </View>
                    <View style={styles.section1}>
                        <Text style={styles.medicine_key}>용법 용량</Text>
                        <Text style={styles.dosageText}>
                            만 12세 이상 소아 및 성인: 1회 1~2정씩 1일 3-4회 (4-6시간 마다) 필요시 복용한다.
                            1일 최대 4그램 (8정)을 초과하여 복용하지 않는다.
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.done_btn_container}>
                <TouchableOpacity style={styles.done_btn} onPress={() => navigation.navigate('Home')}>
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
        marginVertical: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '100%',
        marginLeft: 25,
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
        width: 350,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    done_btn_container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    done_btn: {
        fontSize: 15,
        backgroundColor: '#1967FF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        color: 'white',
        borderRadius: 10,
    },
    done_btn_text: {
        color: 'white',
        fontWeight: 'bold',
    },
    medicine_section: {
        width: '100%',
    },
    section1: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    medicine_key: {
        fontWeight: 'bold',
        color: 'black',
        marginRight: 5,
        marginTop: 10
    },
    dosageText: {
        flex: 1,
        flexWrap: 'wrap',
        marginTop: 10,
    },
    dropdownpicker: {
        borderRadius: 20,
        maxHeight: 25,
        minHeight: 27,
        backgroundColor: 'transparent',
        marginLeft: 10,
        marginTop: 3
    },
    dropdownContainer: {
        width: 80,
        maxHeight: 30,
    },
    dropdown_section: {
        flexDirection: 'row'
    }
});

export default MedicineScan;
