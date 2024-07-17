import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const MyInfo = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>User Name</Text>
                <TextInput style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Email</Text>
                <TextInput style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Password</Text>
                <TextInput style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Password Check</Text>
                <TextInput style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Age</Text>
                <TextInput style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Height / Weight</Text>
                <TextInput style={styles.input} />
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    text: {
        color: '#1F2178',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 3,
        borderColor: '#1F2178',
        borderRadius: 10,
        padding: 9,
    },
    button: {
        borderWidth: 3,
        borderColor: '#1F2178',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#1F2178',
        marginBottom: 20, // 추가된 간격
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MyInfo;
