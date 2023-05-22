import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import md5 from 'md5';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {
  style,
  FontSize,
  colours,
  GET_PROFILE_URL,
  SALT,
  GET_NOTIFI_INDICATOR_URL,
} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import {ToastAndroid} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const Profile = () => {
  const focus = useIsFocused();
  const navigation = useNavigation();
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const role = userid.parameters.user_data.role;
  const [indicator, setIndicator] = useState('');
  const [data, setData] = useState([]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    apiCall();
    notifiIndicator();
  }, [focus]);

  const apiCall = () => {
    try {
      const auth_token = md5(SALT + user_id);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
      };
      const endpoint = GET_PROFILE_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            setData(response.data.parameters);
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('Profile error', error);
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
  return (
    <ScrollView
      style={style.mainContainer}
      showsVerticalScrollIndicator={false}>
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
        <Paragraph style={style.headingText}>Profile Details</Paragraph>
      </View>
      {/* <TouchableOpacity
        style={styles.pswdContainer}
        onPress={() => {
          navigation.navigate('ForgotPassword');
        }}>
        <Paragraph>Change Password</Paragraph>
      </TouchableOpacity> */}
      <View style={styles.titleConatiner}>
        <Paragraph style={styles.textinputHeading}>FULL NAME</Paragraph>
      </View>
      <View style={styles.detailcontainer}>
        <Paragraph style={styles.detail}>{data ? data.name : ''}</Paragraph>
      </View>
      <View style={styles.titleConatiner}>
        <Paragraph style={styles.textinputHeading}>MOBILE NUMBER</Paragraph>
      </View>
      <View style={styles.detailcontainer}>
        <Paragraph style={styles.detail}>{data ? data.mobile : ''}</Paragraph>
      </View>
      <View style={styles.titleConatiner}>
        <Paragraph style={styles.textinputHeading}>
          WORK STATION OR JEWELLERY STORE
        </Paragraph>
      </View>
      <View style={styles.detailcontainer}>
        {role === 'CUSTOMER' ? (
          <Paragraph style={styles.detail}>Jewellers Dashboard</Paragraph>
        ) : (
          <Paragraph style={styles.detail}>Work Station</Paragraph>
        )}
      </View>
      <View style={styles.titleConatiner}>
        <Paragraph style={styles.textinputHeading}>ADDRESS</Paragraph>
      </View>
      <View style={styles.addressContainer}>
        <Paragraph style={styles.detail}>{data ? data.address : ''}</Paragraph>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logo: {
    // position: 'absolute',
    // top: Platform.OS == 'ios' ? 10 : 15,
    // left: 20,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  menu: {
    // position: 'absolute',
    // top: Platform.OS == 'ios' ? 32 : 25,
    // right: 20,
    // width: 30,
    // height: 30,
    position: 'absolute',
    top: 40,
    right: 20,
    width: 30,
    height: 30,
    backgroundColor: colours.White,
  },
  bell: {
    // position: 'absolute',
    // top: Platform.OS == 'ios' ? 33 : 28,
    // right: 60,
    // width: 30,
    // height: 30,
    position: 'absolute',
    top: 41,
    right: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  heading: {
    marginTop: 12,
    marginLeft: 20,
  },
  titleConatiner: {
    marginTop: 20,
    marginLeft: 20,
  },
  textinputHeading: {
    fontSize: FontSize.NormalFontsize,
    color: colours.SpanishGray,
    fontFamily: 'Karla-Bold',
    marginTop: 5,
  },
  detailcontainer: {
    marginTop: 10,
    marginLeft: 20,
    width: '90%',
    height: 50,
    borderRadius: 5,
    backgroundColor: colours.SnowGrey,
    padding: 15,
  },
  detail: {
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Bold',
  },
  addressContainer: {
    marginTop: 10,
    marginLeft: 20,
    width: '90%',
    borderRadius: 5,
    backgroundColor: colours.SnowGrey,
    padding: 15,
  },
  pswdContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
  },
  redDot: {
    // position: 'absolute',
    // top: Platform.OS == 'ios' ? 50 : 40,
    // zIndex: 1,
    // right: 75,
    position: 'absolute',
    top: 0,
    zIndex: 1,
    right: 55,
  },
});
