import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import {
  colours,
  style,
  FontSize,
  GET_ORDER_LIST_URL,
  SALT,
} from '../../constants';
import {POST_API} from '../../api/POST';
import OrderStatus from '../../components/OrderStatus';
import {useDispatch} from 'react-redux';
import {setFilter} from '../../redux/Slice/user';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PendingOrders = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const role = userid.parameters.user_data.role;
  const filterData = useSelector(state => state.user.filter);
  const focused = useIsFocused();
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);
  const [allItems, setAllItems] = useState(true);
  // console.log('Value of pending', value);
  const [filteredData, setFilteredData] = useState([]);
  const [page_no, setPageNo] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      setLoading(true);
      const auth_token = md5(SALT + user_id + 'PENDING');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'PENDING',
        page_size: 15,
        page: page_no,
        date: filterData.date,
        melting_point: filterData.melting_point,
        model_name: filterData.model_name,
        seal: filterData.seal,
        order_no: filterData.ref_no,
      };
      // console.log('data1', data);
      const endpoint = GET_ORDER_LIST_URL;
      POST_API(endpoint, data)
        .then(response => {
          setLoading(false);
          // console.log('response od pending filter', response.data);
          if (response.data.success) {
            setFilteredData(response.data.parameters.data);
            setValue(response.data.parameters.data);
            setAllItems(true);
          } else {
            setFilteredData([]);
            // Toast.show(`Filter: ${response.data.message}`);
            apiCall();
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log('Pending orders error', error);
    }
  }, [filterData]);

  useEffect(() => {
    if (
      filterData.date !== '' ||
      filterData.melting_point !== '' ||
      filterData.model_name !== '' ||
      filterData.seal !== '' ||
      filterData.ref_no !== ''
    ) {
    } else {
      setFilteredData([]);
      setValue([]);
      apiCall();
    }
  }, [focused]);

  const apiCall = () => {
    try {
      setLoading(true);
      const auth_token = md5(SALT + user_id + 'PENDING');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'PENDING',
        page_size: 15,
        page: page_no,
      };
      // {"message": "Order List", "parameters": {"data": [[Object]], "page": {"current_page": 1, "total_pages": 1}}, "success": true}
      const endpoint = GET_ORDER_LIST_URL;
      // console.log('data', data);
      POST_API(endpoint, data)
        .then(response => {
          setLoading(false);
          // console.log('data of pending', response.data);
          if (response.data.success) {
            dispatch(setFilter(''));
            setFilteredData([]);
            console.log({testData: response.data.parameters});
            setValue(response.data.parameters.data);
            setAllItems(false);
          } else {
            console.log({testData1: response.data});
            // setValue([]);
            Toast.show('no more orders available');
          }
        })
        .catch(error => {
          setLoading(false);
          console.log('error', error);
        });
    } catch (error) {
      setLoading(false);
      console.log('Pending orders error', error);
    }
  };

  const onEndReached = () => {
    // console.log('end');
    setPageNo(page_no + 1);
    const nextPage = page_no + 1;
    try {
      const auth_token = md5(SALT + user_id + 'PENDING');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'PENDING',
        page_size: 15,
        page: nextPage,
      };
      const endpoint = GET_ORDER_LIST_URL;
      // console.log('data', data);
      POST_API(endpoint, data)
        .then(response => {
          if (
            response.data.success &&
            response.data.parameters.data.length > 0
          ) {
            setValue([...value, ...response.data.parameters.data]);
            // setPageNo(nextPage);
            setAllItems(false);
          } else {
            console.log({testData1: response.data});
            setValue(value);
            // apiCall();
          }
        })
        .catch(error => {
          console.log('error of pending', error);
        });
    } catch (error) {
      console.log('Pending orders error', error);
    }
  };
  const onEdit = (status, id) => {
    // console.log('status', status);
    // console.log('status', status);
    // console.log('id', id);
    if (status === 'PENDING') {
      console.log('PENDING');
      navigation.navigate('EditOrders', {id: id});
    } else {
      Alert.alert(
        'Alert',
        'You can edit Pending orders only',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={style.mainContainer}>
      <Header>Pending Orders</Header>
      <View style={styles.filter}>
        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => navigation.navigate('Filter', {data: route.name})}>
          <Image source={require('../../Assets/Image/Filter.png')} />
          <Paragraph>Filter</Paragraph>
        </TouchableOpacity>
      </View>
      {value || filteredData ? (
        loading ? (
          <ActivityIndicator
            size="large"
            color={colours.Black}
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}
          />
        ) : allItems ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            // data={filteredData.length > 0 ? filteredData : value}
            data={filteredData}
            renderItem={({item}) => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.orderContainer}
                  onPress={() => {
                    console.log('upadte');
                    role === 'CUSTOMER'
                      ? onEdit(item.status, item.order_id)
                      : null;
                  }}>
                  {role === 'CUSTOMER' ? (
                    <TouchableOpacity
                      style={styles.repeatContainer}
                      onPress={() => {
                        navigation.navigate('RepeatOrders', {
                          data: item.order_id,
                        });
                      }}>
                      <Paragraph style={styles.repeatText}>
                        Repeat Order
                      </Paragraph>
                    </TouchableOpacity>
                  ) : item.status === 'DELIVERED' ||
                    item.status === 'CUSTOMER DELIVERED' ? null : (
                    <TouchableOpacity
                      style={styles.repeatContainer}
                      onPress={() => {
                        navigation.navigate('UpdateOrder', {
                          data: item.order_id,
                        });
                      }}>
                      <Paragraph style={styles.repeatText}>
                        Update Order
                      </Paragraph>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.arrow}
                    onPress={() => {
                      navigation.navigate('OrderStatus', {data: item.order_id});
                    }}>
                    <Image
                      source={require('../../Assets/Image/DashboardArrow.png')}
                    />
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item.image.length > 0 ? (
                      <View>
                        <Image
                          source={{uri: item.image[0]}}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10,
                            resizeMode: 'cover',
                          }}
                        />
                        <View style={styles.imagelenText}>
                          <Paragraph>{item.image.length}</Paragraph>
                        </View>
                      </View>
                    ) : (
                      <Image
                        source={require('../../Assets/Image/Placeholder.png')}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 10,
                          resizeMode: 'cover',
                        }}
                      />
                    )}
                    <View style={{marginLeft: 10, marginVertical: 10}}>
                      <Paragraph style={styles.headingTextCopy}>
                        Order No: {item.ref_no}
                      </Paragraph>
                      <Paragraph
                        style={{
                          ...style.headingText,
                          marginTop: 0,
                          fontSize: 15,
                        }}>
                        {/* {item.model_name} */}
                        {item.category}
                      </Paragraph>
                      <Paragraph style={styles.headingTextCopy}>
                        Weight: {item.weight}
                      </Paragraph>
                      {item.length_value ? (
                        <Paragraph style={styles.headingTextCopy}>
                          Length/Size: {item.length_value}
                        </Paragraph>
                      ) : (
                        <Paragraph style={styles.headingTextCopy}>
                          Length/Size: --
                        </Paragraph>
                      )}
                      <Paragraph>Melting Point: {item.melting_point}</Paragraph>
                    </View>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Paragraph>Ordered Date: {item.ordered_date}</Paragraph>

                    <OrderStatus status={item.status} />
                  </View>

                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <Paragraph>
                      Ordered Time:{' '}
                      {moment(item.ordered_time, ['HH.mm']).format('hh:mm a')}
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  apiCall();
                  setRefreshing(false);
                }}
              />
            }
            keyExtractor={item => item.order_id}
            onEndReached={() => {
              onEndReached();
            }}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            // data={filteredData.length > 0 ? filteredData : value}
            data={value}
            renderItem={({item}) => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.orderContainer}
                  onPress={() => {
                    console.log('upadte');
                    role === 'CUSTOMER'
                      ? onEdit(item.status, item.order_id)
                      : null;
                  }}>
                  {role === 'CUSTOMER' ? (
                    <TouchableOpacity
                      style={styles.repeatContainer}
                      onPress={() => {
                        navigation.navigate('RepeatOrders', {
                          data: item.order_id,
                        });
                      }}>
                      <Paragraph style={styles.repeatText}>
                        Repeat Order
                      </Paragraph>
                    </TouchableOpacity>
                  ) : item.status === 'DELIVERED' ||
                    item.status === 'CUSTOMER DELIVERED' ? null : (
                    <TouchableOpacity
                      style={styles.repeatContainer}
                      onPress={() => {
                        navigation.navigate('UpdateOrder', {
                          data: item.order_id,
                        });
                      }}>
                      <Paragraph style={styles.repeatText}>
                        Update Order
                      </Paragraph>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.arrow}
                    onPress={() => {
                      navigation.navigate('OrderStatus', {data: item.order_id});
                    }}>
                    <Image
                      source={require('../../Assets/Image/DashboardArrow.png')}
                    />
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item.image.length > 0 ? (
                      <View>
                        <Image
                          source={{uri: item.image[0]}}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10,
                            resizeMode: 'cover',
                          }}
                        />
                        <View style={styles.imagelenText}>
                          <Paragraph>{item.image.length}</Paragraph>
                        </View>
                      </View>
                    ) : (
                      <Image
                        source={require('../../Assets/Image/Placeholder.png')}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 10,
                          resizeMode: 'cover',
                        }}
                      />
                    )}
                    <View style={{marginLeft: 10, marginVertical: 10}}>
                      <Paragraph style={styles.headingTextCopy}>
                        Order No: {item.ref_no}
                      </Paragraph>
                      <Paragraph
                        style={{
                          ...style.headingText,
                          marginTop: 0,
                          fontSize: 15,
                        }}>
                        {/* {item.model_name} */}
                        {item.category}
                      </Paragraph>
                      <Paragraph style={styles.headingTextCopy}>
                        Weight: {item.weight}
                      </Paragraph>
                      {item.length ? (
                        <Paragraph style={styles.headingTextCopy}>
                          Length/Size: {item.length}
                        </Paragraph>
                      ) : (
                        <Paragraph style={styles.headingTextCopy}>
                          Length/Size: --
                        </Paragraph>
                      )}
                      <Paragraph>Melting Point: {item.melting_point}</Paragraph>
                    </View>
                  </View>
                  <View style={styles.line} />
                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Paragraph>Ordered Date: {item.ordered_date}</Paragraph>

                    <OrderStatus status={item.status} />
                  </View>

                  <View
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <Paragraph>
                      Ordered Time:{' '}
                      {moment(item.ordered_time, ['HH.mm']).format('hh:mm a')}
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  apiCall();
                  setRefreshing(false);
                }}
              />
            }
            keyExtractor={item => item.order_id}
            onEndReached={() => {
              onEndReached();
            }}
            onEndReachedThreshold={0.5}
          />
        )
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Paragraph>No pending order available</Paragraph>
        </View>
      )}
    </View>
  );
};

export default PendingOrders;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    height: 20,
    width: '14%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filter: {
    alignItems: 'flex-end',
    marginRight: 20,
    transform: [{translateY: -20}],
  },
  orderContainer: {
    width: screenWidth * 0.87,
    height: screenHeight * 0.25,
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    borderColor: colours.SnowGrey,
    paddingVertical: 10,
  },
  line: {
    borderBottomWidth: 1,
    marginVertical: 10,
    borderColor: colours.SnowGrey,
  },
  repeatContainer: {
    width: '100%',
    transform: [{translateY: -5}],
    height: 15,
    alignItems: 'flex-end',
    marginTop: 5,
  },
  arrow: {
    position: 'absolute',
    right: -30,
    top: (screenHeight * 0.22) / 2 - 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatText: {
    color: colours.ButtonBlueColor,
    fontSize: 12,
  },
  imagelenText: {
    position: 'absolute',
    right: 4,
    top: 60,
    width: 15,
    height: 18,
    alignItems: 'center',
    backgroundColor: colours.ButtonBlueColor,
    borderRadius: 5,
  },
  headingTextCopy: {
    color: colours.Black,
    fontFamily: 'Karla-Bold',
  },
});
