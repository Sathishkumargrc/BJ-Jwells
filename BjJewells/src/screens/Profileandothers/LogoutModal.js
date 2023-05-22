import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import React from 'react';

import {POST_API} from '../../api/POST';
import {colours, style, USER_LOGOUT_URL, SALT} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {setUser} from '../../redux/Slice/user';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const LogoutModal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
      // console.log('deviceInfo', data);
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
    <View
      style={{
        ...style.mainContainer,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.logoutContainer}>
        <Paragraph style={styles.headingText}>
          Are you sure want to Logout
        </Paragraph>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.yesContainer}
            onPress={async () => {
              await AsyncStorage.removeItem('@user_id');
              deviceInfo();
              dispatch(setUser(''));
              Toast.show('Logout Successfully');

              // BackHandler.exitApp();
            }}>
            <Paragraph style={styles.logoutText}>Logout</Paragraph>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.cancelContainer}
            onPress={() => {
              navigation.navigate('Dashboard');
            }}>
            <Paragraph style={styles.logoutText}>Cancel</Paragraph>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  logoutContainer: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
    height: 40,
  },
  yesContainer: {
    width: '30%',
    height: '100%',
    backgroundColor: colours.LightGreen,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelContainer: {
    width: '30%',
    height: '100%',
    backgroundColor: colours.LightOrange,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
