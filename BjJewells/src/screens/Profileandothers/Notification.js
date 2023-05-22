import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import md5 from 'md5';
import {useIsFocused} from '@react-navigation/native';
import {style, GET_NOTIFICATION_URL, SALT, colours} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import OrderStatus from '../../components/OrderStatus';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Notification = () => {
  const focused = useIsFocused();
  const navigation = useNavigation();
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apicall();
  }, [focused]);

  const apicall = () => {
    try {
      const auth_token = md5(SALT + user_id);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
      };
      const endpoint = GET_NOTIFICATION_URL;
      // console.log('dataofnotification', data);
      POST_API(endpoint, data)
        .then(response => {
          // console.log('response of no', response.data.parameters);
          setLoading(false);
          if (response.status === 200) {
            // console.log('response of no', response.data.parameters.data);
            setData(response.data.parameters);
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      console.log('Notification error', error);
    }
  };

  return (
    <View style={style.mainContainer}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Image
          source={require('../../Assets/Image/Back.png')}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <Paragraph style={{...style.headingText, marginTop: 1}}>
          Notifications
        </Paragraph>
      </View>
      {data !== null ? (
        <FlatList
          data={data ? data : []}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{alignItems: 'center', marginTop: 20}}
              onPress={() => {
                navigation.navigate('OrderStatus', {data: item.order_id});
              }}>
              <View style={styles.notificationContainer}>
                <View style={styles.arrowConatiner}>
                  <Image
                    source={require('../../Assets/Image/NotiArrow.png')}
                    style={styles.arrowIcon}
                  />
                </View>
                <View style={styles.notiparaContainer}>
                  <Paragraph
                    style={{
                      ...style.textinputHeading,
                      marginTop: 0,
                      color: colours.Black,
                    }}>
                    Your Order {item.message} status.
                  </Paragraph>
                  <View style={styles.statusConatiner}>
                    {/* <OrderStatus status={item.order.status} /> */}
                    <Paragraph>{item.created_at}</Paragraph>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.notification_id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                setLoading(true);
                apicall();
                setLoading(false);
              }}
            />
          }
        />
      ) : (
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Paragraph>No Notification Found</Paragraph>
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  back: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContainer: {
    marginLeft: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  notificationContainer: {
    width: screenWidth * 0.87,
    height: screenHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colours.SnowGrey,
    borderRadius: 10,
  },
  notiparaContainer: {
    width: screenWidth * 0.65,
    marginLeft: 10,
    paddingLeft: 20,
  },
  statusConatiner: {
    width: screenWidth * 0.6,
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
  },
});
