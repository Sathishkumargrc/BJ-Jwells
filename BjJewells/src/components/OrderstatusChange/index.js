import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import md5 from 'md5';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {
  colours,
  FontSize,
  CHANGE_ORDER_STATUS_URL,
  SALT,
} from '../../constants';
import Paragraph from '../Paragraph';
import {POST_API} from '../../api/POST';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const StatusChange = props => {
  console.log('props', props);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;

  const statusApi = async (order_id, action) => {
    setLoading(true);
    console.log('order_id', order_id);
    console.log('action', `"${action}"`);
    const auth_token = md5(SALT + user_id + order_id + action);
    const data = {
      user_id: user_id,
      auth_token: auth_token,
      order_id: order_id,
      action: action,
    };
    const endpoint = CHANGE_ORDER_STATUS_URL;
    console.log('data', data);
    POST_API(endpoint, data)
      .then(res => {
        if (res.data.success) {
          setLoading(false);
          ToastAndroid.show(
            'Order status changed successfully',
            ToastAndroid.SHORT,
          );
          navigation.navigate('OrderStatus', {data: order_id});
        } else {
          setLoading(false);
          console.log('res', res.data);
          Alert.alert('Error', res.data.message);
        }
      })
      .catch(err => {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      });
  };

  if (props.status === 'ACCEPT') {
    return (
      <>
        {loading ? (
          <View style={styles.acceptContainer}>
            <ActivityIndicator size="small" color={colours.Black} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.acceptContainer}
            onPress={() => statusApi(props.order_id, 'ON PROGRESS')}>
            <Paragraph style={{...styles.Text, color: colours.Red}}>
              On Progress
            </Paragraph>
          </TouchableOpacity>
        )}
      </>
    );
  } else if (props.status === 'CUSTOMER DELIVERED') {
    return <View></View>;
  } else if (props.status === 'REJECT') {
    return <View></View>;
  } else if (props.status === 'ASSIGNED') {
    return (
      <>
        {loading ? (
          <View
            style={{
              ...styles.acceptContainer,
              width: screenWidth * 0.5,
              backgroundColor: colours.LightGreen,
            }}>
            <ActivityIndicator size="small" color={colours.Black} />
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                ...styles.acceptContainer,
                width: screenWidth * 0.5,
                backgroundColor: colours.LightRose,
              }}
              onPress={() => statusApi(props.order_id, 'REJECT')}>
              <Paragraph style={{...styles.Text, color: colours.Red}}>
                Reject
              </Paragraph>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.acceptContainer,
                width: screenWidth * 0.5,
                backgroundColor: colours.LightGreen,
              }}
              onPress={() => statusApi(props.order_id, 'ACCEPT')}>
              <Paragraph style={{...styles.Text, color: colours.Red}}>
                Accept
              </Paragraph>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  } else if (props.status === 'PENDING') {
    return <View />;
  } else if (props.status === 'COMPLETED') {
    return <View />;
  } else if (props.status === 'ON PROGRESS') {
    return (
      <>
        {loading ? (
          <View
            style={{
              ...styles.acceptContainer,
              backgroundColor: colours.LightGreen,
            }}>
            <ActivityIndicator size="small" color={colours.Black} />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              ...styles.acceptContainer,
              backgroundColor: colours.LightGreen,
            }}
            onPress={() => {
              statusApi(props.order_id, 'DELIVERED');
            }}>
            <Paragraph style={{...styles.Text, color: colours.Green}}>
              Delievered
            </Paragraph>
          </TouchableOpacity>
        )}
      </>
    );
  } else {
    return <View></View>;
  }
};

export default StatusChange;

const styles = StyleSheet.create({
  acceptContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight * 0.07,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colours.LightOrange,
    marginBottom: 30,
  },
  Text: {
    fontSize: FontSize.MediumFontsize,
    color: colours.Orange,
  },
});
