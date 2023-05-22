import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  BackHandler,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import {VERSION_URL} from '../../constants';
import {GET_API} from '../../api/GET';

import {useIsFocused} from '@react-navigation/native';

import Paragraph from '../../components/Paragraph';
import {
  colours,
  style,
  GET_DASHBOARD_URL,
  SALT,
  GET_NOTIFI_INDICATOR_URL,
  USER_DEVICE_REGISTER_URL,
  GET_CATALOG_LIST,
  FontSize,
} from '../../constants';
import {POST_API} from '../../api/POST';
import {set, Value} from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import Firebase from '@react-native-firebase/app';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

import ModalComponenet from '../../components/Modal';
import {useDispatch} from 'react-redux';
import {setCatalogImage} from '../../redux/Slice/user';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Dashboard = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [indicator, setIndicator] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [device_model, setDeviceModel] = useState('');
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [catalog, setCatalog] = useState('');
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const role = userid.parameters.user_data.role;
  const focused = useIsFocused();
  const navigation = useNavigation();
  const [appVersion, setAppVersion] = useState();
  console.log('appstate', appVersion);

  useEffect(() => {
    checkAppVersion();
    apicall();
    notifiIndicator();
    checkToken();
    getInitialNotification();
    catalogList();
    setAppVersion();
  }, [focused]);
  useEffect(() => {
    deviceInfo();
  }, [device_model]);

  const checkAppVersion = () => {
    const device_version2 = DeviceInfo.getVersion();
    const device_buildno = DeviceInfo.getBuildNumber();
    //  const device_version3 = 1.0.3
    // const device_buildno = 4
    console.log('device_info1', device_version2, device_buildno);
    try {
      const endpoint = VERSION_URL;
      GET_API(endpoint)
        .then(res => {
          if (res.data.success) {
            console.log('loginversion', res.data.parameters);
            setAppVersion(res.data.parameters.android.is_force_update);

            if (Platform.OS === 'android') {
              if (
                res.data.parameters.android.app_version > device_version2 ||
                res.data.parameters.android.build_no > device_buildno
              ) {
                if (res.data.parameters.android.is_force_update === 0) {
                  showAlert1();
                } else {
                  showAlert2();
                }
              } else {
                console.log('deviceinfo small');
              }
            } else if (Platform.OS === 'ios') {
              if (
                res.data.parameters.ios.app_version > device_version2 ||
                res.data.parameters.ios.build_no > device_buildno
              ) {
                if (res.data.parameters.ios.is_force_update === 0) {
                  showAlert1();
                } else {
                  showAlert2();
                }
              } else {
                console.log('deviceinfo small');
              }
            }
          } else {
            console.log('versionerror', res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log('verserr', err);
    }
  };

  const showAlert1 = () => {
    Alert.alert('App Update', 'App need to be updated', [
      {
        text: 'Skip',
        // onPress: () => BackHandler.exitApp(),
        onPress: () => console.log('app not updated'),
        style: 'cancel',
      },
      {
        text: 'update',
        onPress: () => (Platform.OS === 'android' ? playStore() : appStore()),
        style: 'cancel',
      },
    ]);
  };
  const showAlert2 = () => {
    Alert.alert('App Update', 'App need to be updated', [
      {
        text: 'update',
        onPress: () => (Platform.OS === 'android' ? playStore() : appStore()),
        style: 'cancel',
      },
    ]);
  };

  const playStore = () => {
    // Linking.openURL("https://play.google.com/store/apps/details?id=com.bjjewells");
    const GOOGLE_PACKAGE_NAME = 'com.bjjewells';
    Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`);
  };
  const appStore = () => {
    Linking.openURL('https://apps.apple.com/us/app/sri-bj-jewels/id1641437150');
  };

  const apicall = () => {
    try {
      const auth_token = md5(SALT + user_id);

      const data = {
        user_id: user_id,
        auth_token: auth_token,
      };
      // console.log('data of dashdoard', data);
      const endpoint = GET_DASHBOARD_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            console.log('response', response.data);
            setValue(response.data.parameters);
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('Dashboard err', error);
    }
  };

  const notifiIndicator = () => {
    try {
      const auth_token = md5(SALT + user_id);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
      };
      const endpoint = GET_NOTIFI_INDICATOR_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            // console.log('response', response.data);
            setIndicator(response.data.parameters);
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('Dashboard err1', error);
    }
  };

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // console.log('fcm token', fcmToken);
      setFcmToken(fcmToken);
    }
    let DeviceName = DeviceInfo.getDeviceName().then(res => {
      setDeviceModel(res);
    });
    // console.log('DeviceName', DeviceName);
  };

  const deviceInfo = () => {
    try {
      let DeviceId = DeviceInfo.getUniqueId();
      let DeviceOS = Platform.OS;
      const auth_token = md5(SALT + user_id + fcmToken + DeviceOS);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        fcm_device_token: fcmToken,
        unique_device_id: DeviceId,
        device_model: device_model,
        device_type: DeviceOS,
      };
      const endpoint = USER_DEVICE_REGISTER_URL;
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

  getInitialNotification = () => {
    Firebase.initializeApp;
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  const catalogList = () => {
    const auth_token = md5(SALT + user_id);
    const data = {
      user_id: user_id,
      auth_token: auth_token,
    };
    const endpoint = GET_CATALOG_LIST;
    POST_API(endpoint, data)
      .then(res => {
        // console.log('res of catalog', res.data);
        setCatalog(res.data.parameters);
      })
      .catch(err => {
        // console.log('err of catalog', err);
        Toast.show(err);
      });
  };

  return (
    <SafeAreaView style={style.mainContainer}>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          width: screenWidth * 0.87,
          marginLeft: 20,
          justifyContent: 'space-between',
        }}>
        <Image source={require('../../Assets/Image/logo.png')} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 60,
            justifyContent: 'space-between',
          }}>
          {indicator.is_notify ? (
            <View style={styles.redDot}>
              <Image source={require('../../Assets/Image/RedDot.png')} />
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notification');
            }}>
            <Image source={require('../../Assets/Image/Notification.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}>
            <Image source={require('../../Assets/Image/menu.png')} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.heading}>
        {role === 'CUSTOMER' ? (
          <Paragraph style={styles.headingText}>Jewellers Dashboard</Paragraph>
        ) : (
          <Paragraph style={styles.headingText}>Work Station</Paragraph>
        )}
      </View>

      {value ? (
        <View
          style={{alignItems: 'center'}}
          RefreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                setRefreshing(true);
                apicall();
                notifiIndicator();
                setRefreshing(false);
              }}
            />
          }>
          <TouchableOpacity
            style={styles.ordersContainer}
            onPress={() => {
              navigation.navigate('PendingOrders');
            }}>
            <View style={styles.iconContainer}>
              <Image source={require('../../Assets/Image/Pending.png')} />
            </View>
            <View style={styles.orderTextCon}>
              <Paragraph style={styles.orderCount}>
                {value ? value.pending_order : ''}
              </Paragraph>
              <Paragraph style={styles.ordersText}>Pending Orders</Paragraph>
            </View>
            <View style={styles.arrow}>
              <Image
                source={require('../../Assets/Image/DashboardArrow.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ordersContainer}
            onPress={() => {
              navigation.navigate('CompleteOrders');
            }}>
            <View style={styles.icon1Container}>
              <Image source={require('../../Assets/Image/Complete.png')} />
            </View>
            <View style={styles.orderTextCon}>
              <Paragraph style={styles.orderCount}>
                {value ? value.completed_order : null}
              </Paragraph>
              <Paragraph style={styles.ordersText}>Complete Orders</Paragraph>
            </View>
            <View style={styles.arrow}>
              <Image
                source={require('../../Assets/Image/DashboardArrow.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ordersContainer}
            onPress={() => {
              navigation.navigate('AllOrders');
            }}>
            <View style={styles.icon2Container}>
              <Image source={require('../../Assets/Image/Bag.png')} />
            </View>
            <View style={styles.orderTextCon}>
              <Paragraph style={styles.orderCount}>
                {value ? value.all_order : null}
              </Paragraph>
              <Paragraph style={styles.ordersText}>All Orders</Paragraph>
            </View>
            <View style={styles.arrow}>
              <Image
                source={require('../../Assets/Image/DashboardArrow.png')}
              />
            </View>
          </TouchableOpacity>

          {/* Changes...! */}

          <TouchableOpacity
            style={styles.ordersContainer}
            onPress={() => {
              navigation.navigate('RecentDelivered');
            }}>
            <View style={styles.icon2Container}>
              <Image source={require('../../Assets/Image/Bag.png')} />
            </View>
            <View style={styles.orderTextCon}>
              <Paragraph style={styles.orderCount}>
                {value ? value.recent_order : null}
                {/* {console.log('>>>>>>>',value.recent_order)} */}
              </Paragraph>
              <Paragraph style={styles.ordersText}>Recent Delivered Orders</Paragraph>
            </View>
            <View style={styles.arrow}>
              <Image
                source={require('../../Assets/Image/DashboardArrow.png')}
              />
            </View>
          </TouchableOpacity>

          {role === 'CUSTOMER' ? (
            <>
              <TouchableOpacity
                style={styles.ordersContainer}
                onPress={() => {
                  setVisible(true);
                }}>
                <View style={styles.icon3Container}>
                  <Image
                    source={require('../../Assets/Image/images.jpeg')}
                    style={{width: 20, height: 20}}
                  />
                </View>
                <View style={styles.orderTextCon}>
                  <Paragraph style={styles.orderCount}>
                    {catalog ? catalog.length : null}
                  </Paragraph>
                  <Paragraph style={styles.ordersText}>Catalouge</Paragraph>
                </View>
                <View style={styles.arrow}>
                  <Image
                    source={require('../../Assets/Image/DashboardArrow.png')}
                  />
                </View>
              </TouchableOpacity>
              {catalog ? (
                <ModalComponenet
                  isVisible={visible}
                  onBackdropPress={() => {
                    setVisible(false);
                  }}
                  onBackButtonPress={() => {
                    setVisible(false);
                  }}
                  data={catalog}
                  onImagePress={(item, index) => {
                    setVisible(false);
                    dispatch(setCatalogImage(item.image_url));
                    navigation.navigate('Image');
                  }}
                  onPress={(item, index) => {
                    console.log(item);
                  }}
                />
              ) : null}
            </>
          ) : null}
        </View>
      ) : (
        <ActivityIndicator
          size="large"
          color={colours.Black}
          style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
        />
      )}
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menu: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 30,
    height: 30,
    backgroundColor: colours.White,
  },
  bell: {
    position: 'absolute',
    top: 41,
    right: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  heading: {
    marginLeft: 20,
  },
  headingText: {
    fontSize: FontSize.HedingFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Bold',
    marginTop: 20,
  },
  ordersContainer: {
    width: screenWidth * 0.87,
    borderWidth: 1,
    height: screenHeight * 0.1,
    marginTop: 20,
    borderRadius: 10,
    borderColor: colours.BorderGrey,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: colours.LightOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon1Container: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: colours.LightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon2Container: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: colours.LightYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon3Container: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#fccbb1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderTextCon: {
    marginLeft: 30,
    height: 50,
    justifyContent: 'center',
  },
  orderCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ordersText: {
    color: colours.orderText,
  },
  arrow: {
    position: 'absolute',
    right: -10,
    top: (screenHeight * 0.1) / 2,
  },
  redDot: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    right: 55,
  },
});
