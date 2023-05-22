import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import {
  colours,
  style,
  FontSize,
  GET_ORDER_LIST_URL,
  SALT,
  GET_NOTIFI_INDICATOR_URL,
} from '../../constants';
import moment from 'moment';
import {POST_API} from '../../api/POST';
import OrderStatus from '../../components/OrderStatus';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {setFilter} from '../../redux/Slice/user';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AllOrders = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  // console.log('route pf all order', route.name);
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const role = userid.parameters.user_data.role;
  const filterData = useSelector(state => state.user.filter);
  const focused = useIsFocused();
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);
  const [value1, setValue1] = useState([]);
  const [allItems, setAllItems] = useState(true);
  console.log('setvalueis', value1);
  const [loading, setLoading] = useState(false);
  const [indicator, setIndicator] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  // console.log('filter data', filteredData);
  const [page_no, setPageNo] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState();
  useEffect(() => {
    try {
      setLoading(true);
      const auth_token = md5(SALT + user_id + 'ALL');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'ALL',
        page_size: 15,
        page: page_no,
        date: filterData.date ? filterData.date : '',
        melting_point: filterData.melting_point ? filterData.melting_point : '',
        model_name: filterData.model_name ? filterData.model_name : '',
        seal: filterData.seal ? filterData.seal : '',
        order_no: filterData.ref_no ? filterData.ref_no : '',
      };
      // console.log('data of filter', data);
      const endpoint = GET_ORDER_LIST_URL;
      POST_API(endpoint, data)
        .then(response => {
          setLoading(false);
          // console.log('response of filterorder', response.data);
          if (response.data.success) {
            // console.log('response of filter1', response.data);
            setFilteredData(response.data.parameters.data);
            setValue(response.data.parameters.data);
            setAllItems(true);
          } else {
            // console.log('error of filter2', response.data.message);
            setFilteredData([]);
            // setTimeout(() => {
            //   Toast.show(`Filter: ${response.data.message}`);
            // }, 1000);

            apiCall();
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log('All orders error', error);
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
      notifiIndicator();
    } else {
      setFilteredData([]);
      setValue([]);
      apiCall();
      notifiIndicator();
    }
  }, [focused]);

  const apiCall = () => {
    try {
      setLoading(true);
      const auth_token = md5(SALT + user_id + 'ALL');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'ALL',
        page_size: 15,
        page: page_no,
      };
      const endpoint = GET_ORDER_LIST_URL;

      POST_API(endpoint, data)
        .then(response => {
          setLoading(false);
          if (response.data.success) {
            dispatch(setFilter(''));
            setFilteredData([]);
            setValue(response.data.parameters.data);
            setAllItems(false);
            // console.log('response pf all ordersvalue', response.data);
          } else {
            // console.log({testData1: response.data});
            setValue(value);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log('All orders error', error);
    }
  };

  const onEdit = (status, id) => {
    // console.log('status', status);
    // console.log('status', status);
    // console.log('id', id);
    if (status === 'PENDING') {
      // console.log('PENDING');
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

  const pagination = () => {
    // console.log('end');
    setPageNo(page_no + 1);
    const nextPage = page_no + 1;
    // setPageNo(nextPage);
    // setPage(page_no+1)
    try {
      const auth_token = md5(SALT + user_id + 'ALL');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'ALL',
        page_size: 15,
        page: nextPage,
      };
      console.log('data of pag', data);
      const endpoint = GET_ORDER_LIST_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (
            response.data.success &&
            response.data.parameters.data.length > 0
          ) {
            // setValue([...value, ...response.data.parameters.data]);
            setValue([...value, ...response.data.parameters.data]);

            setValue1([response.data.parameters.data]);
            setAllItems(false);
            // setPageNo(nextPage);
            // setPageNo(page_no+1);
            // setPage(page);
            console.log('paginationis', response.data.parameters.data);
          } else {
            console.log({testData1: response.data});
            Toast.show('no more orders available');
            // setValue([]);
            // apiCall();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('all orders error', error);
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
            // console.log('response of notification', response.data);
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
    <View style={style.mainContainer}>
      {route.name === 'Home' ? (
        <>
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
                <Image
                  source={require('../../Assets/Image/Notification.png')}
                />
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
            <Paragraph style={style.headingText}>All Orders</Paragraph>
          </View>
        </>
      ) : (
        <Header>All Orders</Header>
      )}

      <View style={styles.filter}>
        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => navigation.navigate('Filter', {data: route.name})}>
          <Image source={require('../../Assets/Image/Filter.png')} />
          <Paragraph>Filter</Paragraph>
        </TouchableOpacity>
      </View>
      {filteredData || value ? (
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
            // data={value}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{height: 60}}
            renderItem={({item}) => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.orderContainer}
                  onPress={() => {
                    // console.log('upadte');
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
                        // console.log('unpdate...........');
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
                      navigation.navigate('OrderStatus', {
                        data: item.order_id,
                        routeName: ' AllOrders',
                      });
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
                      <View style={{width: screenWidth * 0.4, height: 20}}>
                        <Paragraph
                          style={{
                            ...style.headingText,
                            marginTop: 0,
                            fontSize: 15,
                          }}>
                          {/* {item.model_name} */}
                          {item.category}
                        </Paragraph>
                      </View>
                      <Paragraph style={styles.headingTextCopy}>
                        Weight: {item.weight}
                      </Paragraph>
                      <Paragraph style={styles.headingTextCopy}>
                        Length/Size: {item.length_value}
                      </Paragraph>
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
            onEndReachedThreshold={0.2}
            onEndReached={({distanceFromEnd}) => {
              // if(distanceFromEnd>0){
              pagination();
              // }
            }}
            // onEndReachedThreshold={0.5}
            // onEndReached={({distanceFromEnd}) => {
            //   // if(distanceFromEnd>0){
            //      pagination();
            //   // }

            // }}
          />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              // data={filteredData.length > 0 ? filteredData : value}
              data={value}
              // data={value}
              ListFooterComponent={<View />}
              ListFooterComponentStyle={{height: 60}}
              renderItem={({item}) => (
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.orderContainer}
                    onPress={() => {
                      // console.log('upadte');
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
                          // console.log('unpdate...........');
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
                        navigation.navigate('OrderStatus', {
                          data: item.order_id,
                          routeName: ' AllOrders',
                        });
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
                        <View style={{width: screenWidth * 0.4, height: 20}}>
                          <Paragraph
                            style={{
                              ...style.headingText,
                              marginTop: 0,
                              fontSize: 15,
                            }}>
                            {/* {item.model_name} */}
                            {item.category}
                          </Paragraph>
                        </View>
                        <Paragraph style={styles.headingTextCopy}>
                          Weight: {item.weight}
                        </Paragraph>
                        <Paragraph style={styles.headingTextCopy}>
                          Length/Size: {item.length_value}
                        </Paragraph>
                        <Paragraph>
                          Melting Point: {item.melting_point}
                        </Paragraph>
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
              onEndReachedThreshold={0.2}
              onEndReached={({distanceFromEnd}) => {
                // if(distanceFromEnd>0){
                pagination();
                // }
              }}
              // onEndReachedThreshold={0.5}
              // onEndReached={({distanceFromEnd}) => {
              //   // if(distanceFromEnd>0){
              //      pagination();
              //   // }

              // }}
            />
          </View>
        )
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Paragraph>No new order available</Paragraph>
        </View>
      )}
    </View>
  );
};

export default AllOrders;

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
    paddingVertical: 10,
    borderColor: colours.SnowGrey,
  },
  line: {
    borderBottomWidth: 1,
    marginVertical: 10,
    borderColor: colours.SnowGrey,
  },
  repeatContainer: {
    width: '100%',
    transform: [{translateY: -5}],
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 10,
  },
  arrow: {
    position: 'absolute',
    right: -30,
    top: (screenHeight * 0.2) / 2 - 10,
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
  logo: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',

    marginLeft: 20,
    justifyContent: 'space-between',
  },
  menu: {
    // position: 'absolute',
    // top: Platform.OS == 'ios' ? 41 : 32,
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
    // top: Platform.OS == 'ios' ? 40 : 33,
    // right: 60,
    // width: 30,
    // height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
    justifyContent: 'space-between',
  },
  heading: {
    marginTop: 18,
    marginLeft: 20,
  },
  headingTextCopy: {
    color: colours.Black,
    fontFamily: 'Karla-Bold',
  },
  redDot: {
    // position: 'absolute',
    // top: Platform.OS == 'ios' ? 50 : 40,
    // zIndex: 1,
    // right: 75,
    // position: 'absolute',
    // top: 0,
    // zIndex: 1,
    // right: 55,
    position: 'absolute',
    top: 0,
    zIndex: 1,
    right: 55,
  },
});
