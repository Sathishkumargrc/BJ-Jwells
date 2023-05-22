import {StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import md5 from 'md5';
import Paragraph from '../Paragraph';
import {style, SALT, GET_NOTIFI_INDICATOR_URL} from '../../constants';
import {POST_API} from '../../api/POST';

const index = props => {
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const [indicator, setIndicator] = useState('');
  useEffect(() => {
    notifiIndicator();
  }, [props]);
  const navigation = useNavigation();
  // console.log('props', props);
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
            // console.log('response od notifi', response.data);
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
    <View>
      <View style={styles.conatiner}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={require('../../Assets/Image/Back.png')} />
        </TouchableOpacity>
        {indicator.is_notify ? (
          <View style={styles.redDot}>
            <Image source={require('../../Assets/Image/RedDot.png')} />
          </View>
        ) : null}
        <View style={styles.menuNotification}>
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
      <View style={styles.headingContainer}>
        <Paragraph style={{...style.headingText, marginTop: 1}}>
          {props.children}
        </Paragraph>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '15%',
    justifyContent: 'space-between',
  },
  headingContainer: {
    marginLeft: 20,
    width: '50%',
    height: 30,
  },
  redDot: {
    position: 'absolute',
    top: 15,
    zIndex: 1,

    right: 65,
  },
});
