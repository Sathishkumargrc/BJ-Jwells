import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ToastAndroid,
  BackHandler,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import md5 from 'md5';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {POST_API} from '../../api/POST';

import Paragraph from '../Paragraph';
import {colours, FontSize, style, USER_LOGOUT_URL, SALT} from '../../constants';
import {setUser} from '../../redux/Slice/user';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const data = [
  {
    id: 1,
    name: 'About Us',
    label: 'About',
    image: require('../../Assets/Image/About.png'),
  },
  {
    id: 2,
    name: 'Contact Us',
    label: 'Contact',
    image: require('../../Assets/Image/Contact.png'),
  },
  {
    id: 3,
    name: 'Payment Details',
    label: 'Payment',
    image: require('../../Assets/Image/Payment.png'),
  },
];

export const DrawerContent = () => {
  const dispatch = useDispatch();
  const version = DeviceInfo.getVersion();

  const onLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            deviceInfo();
            await AsyncStorage.removeItem('@user_id');
            dispatch(setUser(''));
            ToastAndroid.show('Logout Successfully', ToastAndroid.SHORT);
            // BackHandler.exitApp();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const userid = useSelector(state => state.user.user_id);
  const name = userid.parameters.user_data.name;
  const role = userid.parameters.user_data.role;
  const user_id = userid.parameters.user_data.user_id;
  const navigation = useNavigation();

  const deviceInfo = async () => {
    try {
      const fcmToken = await messaging().getToken();
      let DeviceId = DeviceInfo.getUniqueId();
      let DeviceOS = Platform.OS;
      const auth_token = md5(SALT + user_id + fcmToken + DeviceOS);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        fcm_device_token: fcmToken,
        unique_device_id: DeviceId,
        device_type: DeviceOS,
      };
      const endpoint = USER_LOGOUT_URL;
      console.log('deviceInfo', data);
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            console.log('device register', response.data);
          } else {
            console.log('device register', response.data);
          }
        })
        .catch(error => {
          console.log('err', error);
        });
    } catch (error) {
      console.log('Dashboard err2', error);
    }
  };
  return (
    <View style={style.mainContainer}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={require('../../Assets/Image/Back.png')}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </TouchableOpacity>
      <View style={styles.logo}>
        <Image source={require('../../Assets/Image/logo1.png')} />
      </View>
      <View style={styles.nameContainer}>
        <Paragraph style={styles.nametext}>{name}</Paragraph>
      </View>
      <View style={styles.roleContainer}>
        {role === 'CUSTOMER' ? (
          <Paragraph style={styles.roleText}>Jewellers Dashboard</Paragraph>
        ) : (
          <Paragraph style={styles.roleText}>Work Station</Paragraph>
        )}
      </View>
      {role === 'CUSTOMER' ? (
        <View style={{marginTop: 30}}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() => {
                navigation.navigate(item.label);
              }}>
              <Image source={item.image} style={styles.image} />
              <Paragraph style={styles.itemText}>{item.name}</Paragraph>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={{marginVertical: 50}}>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              navigation.navigate('Contact');
            }}>
            <Image
              source={require('../../Assets/Image/About.png')}
              style={styles.image}
            />
            <Paragraph style={styles.itemText}>Contact us</Paragraph>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.versionConatiner}>
        <Paragraph style={styles.signoutText}>Version {version}</Paragraph>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          onLogout();
        }}>
        <Image source={require('../../Assets/Image/Logout.png')} />
        <Paragraph style={styles.logoutText}>Logout</Paragraph>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    marginTop: 150,
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  nametext: {
    fontSize: FontSize.LargeFontsize,
    fontFamily: 'Karla-Bold',
  },
  roleContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  roleText: {
    fontSize: FontSize.LargeFontsize,
    fontFamily: 'Karla-Bold',
    color: colours.SpanishGray,
  },
  itemContainer: {
    width: screenWidth * 0.8,
    height: 60,
    backgroundColor: colours.SnowGrey,
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colours.SpanishGray,
  },
  itemText: {
    marginLeft: 20,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
    marginLeft: 20,
  },
  versionConatiner: {
    position: 'absolute',
    bottom: 60,
    height: 60,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 30,
    left: 10,
    width: 30,
    height: 30,
  },
});
