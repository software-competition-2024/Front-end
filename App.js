import React, {useState} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
import Medicine from './src/pages/Medicine';
import Prescription from './src/pages/Prescription';
import MyPage from './src/pages/MyPage';
import LoginPage from './src/pages/Login/LoginPage';
import SignUpPage from './src/pages/SignUp/SignUpPage';
import NextSignUpStep from './src/pages/SignUp/NextSignUpStep';
import StartPage from './src/pages/Start/StartPage';
import MedicineDetail from './src/pages/MedicineDetail';
import MyInfo from './src/pages/MyInfo';
import PrescriptionScan from './src/pages/PrescriptionScan';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#1F2178',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          height: 75,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderTopWidth: 3,
          borderColor: '#1F2178',
          borderWidth: 3,
          position: 'absolute',
        },
        tabBarItemStyle: {
          flex: 1,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Prescription"
        component={Prescription}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./assets/icon/active_prescription.png')
                  : require('./assets/icon/inactive_prescription.png')
              }
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Medicine"
        component={Medicine}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./assets/icon/active_medicine.png')
                  : require('./assets/icon/inactive_medicine.png')
              }
              style={styles.tabBarIcon1}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./assets/icon/active_home.png')
                  : require('./assets/icon/inactive_home.png')
              }
              style={styles.tabBarIcon}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./assets/icon/active_mypage.png')
                  : require('./assets/icon/inactive_mypage.png')
              }
              style={styles.tabBarIcon1}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLogged ? 'MainScreen' : 'LoginPage'}
        screenOptions={{
          headerStyle: {backgroundColor: '#1F2178'},
          headerTitleAlign: 'center',
          headerTitleStyle: {color: '#FFFFFF', fontWeight: 'bold'},
        }}>
        {isLogged ? (
          // 로그인 되었을때의 페이지
          <>
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MedicineDetail"
              component={MedicineDetail}
              options={{headerShown: false}}
              
            //<Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name='Medimate' component={MainScreen} />
            <Stack.Screen name='MyInfo' component={MyInfo} />
            <Stack.Screen
              name='PrescriptionScan'
              component={PrescriptionScan}
              options={{
                title: '처방전 스캔',
              }}
            />
          </>
        ) : (
          // 로그인 안되었을때의 페이지
          <>
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUpPage"
              component={SignUpPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NextSignUpStep"
              component={NextSignUpStep}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="StartPage"
              component={StartPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MedicineDetail"
              component={MedicineDetail}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarIcon: {
    width: 28,
    height: 33,
    marginTop: 5,
  },
  tabBarIcon1: {
    width: 33,
    height: 33,
    marginTop: 5,
  },

});

export default App;
