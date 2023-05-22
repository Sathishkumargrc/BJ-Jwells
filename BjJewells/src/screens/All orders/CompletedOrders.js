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
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
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

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CompleteOrders = () => {
  const route = useRoute();
  // console.log('route name', route.name);
  const navigation = useNavigation();
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const role = userid.parameters.user_data.role;
  const filterData = useSelector(state => state.user.filter);
  // console.log('filtereddatais',filterData)
  const focused = useIsFocused();
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page_no, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const auth_token = md5(SALT + user_id + 'COMPLETED');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'COMPLETED',
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
          if (response.data.success) {
            setFilteredData(response.data.parameters.data);
            setValue(response.data.parameters.data);
            setAllItems(true);
            // console.log('completedis',response.data.parameters.data)
          } else {
            setFilteredData([]);
            // Toast.show(`Filter: ${response.data.message}`);
            apiCall();
            // console.log('error', response.data.message);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log('complete orders error', error);
    }
  }, [filterData]);
  useEffect(() => {
    if (
      filterData.date !== '' ||
      filterData.melting_point !== '' ||
      filterData.model_name ||
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
      const auth_token = md5(SALT + user_id + 'COMPLETED');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'COMPLETED',
        page_size: 15,
        page: page_no,
      };
      const endpoint = GET_ORDER_LIST_URL;
      // console.log('data', data);
      POST_API(endpoint, data)
        .then(response => {
          setLoading(false);
          if (response.data.success) {
            setFilteredData([]);
            setValue(response.data.parameters.data);
            setAllItems(false);
          } else {
            setValue(value);
            // setValue([]);
            // setData(response.data.parameters);
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      setLoading(false);
      console.log('completed orders error', error);
    }
  };

  const onEndReached = () => {
    console.log('end');
    setPageNo(page_no + 1);
    const nextPage = page_no + 1;
    try {
      const auth_token = md5(SALT + user_id + 'COMPLETED');
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        type: 'COMPLETED',
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
            // console.log('response', response.data.parameters.data);
            // setValue([...filteredData, ...response.data.parameters.data]);
            setValue([...value, ...response.data.parameters.data]);
            setAllItems(false);
            // setPageNo(nextPage);
          } else {
            console.log({testData1: response.data});
            Toast.show('no more orders available');
            setValue(value);
            // apiCall();
            // setData(response.data.parameters);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('complete orders error', error);
    }
  };

  return (
    <View style={style.mainContainer}>
      <Header>Complete Orders</Header>
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
                <TouchableOpacity style={styles.orderContainer}>
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
                  ) : null}
                  <TouchableOpacity
                    style={styles.arrow}
                    onPress={() => {
                      navigation.navigate('OrderStatus', {data: item.order_id});
                    }}>
                    <Image
                      source={require('../../Assets/Image/DashboardArrow.png')}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center',
                    }}>
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

                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Paragraph>Ordered Date: {item.ordered_date}</Paragraph>
                    <OrderStatus status={item.status} />
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
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
            onEndReachedThreshold={0.4}
            onEndReached={({distanceFromEnd}) => {
              onEndReached();
            }}
            // onEndReached={() => {
            //   onEndReached();
            // }}
            // onEndReachedThreshold={0.5}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            // data={filteredData.length > 0 ? filteredData : value}
            data={value}
            renderItem={({item}) => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity style={styles.orderContainer}>
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
                  ) : null}
                  <TouchableOpacity
                    style={styles.arrow}
                    onPress={() => {
                      navigation.navigate('OrderStatus', {data: item.order_id});
                    }}>
                    <Image
                      source={require('../../Assets/Image/DashboardArrow.png')}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center',
                    }}>
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

                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Paragraph>Ordered Date: {item.ordered_date}</Paragraph>
                    <OrderStatus status={item.status} />
                  </View>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
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
              onEndReached();
            }}
            // onEndReached={() => {
            //   onEndReached();
            // }}
            // onEndReachedThreshold={0.5}
          />
        )
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Paragraph>No new order available</Paragraph>
        </View>
      )}
    </View>
  );
};

export default CompleteOrders;

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
    height: screenHeight * 0.22,
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
    marginTop: 10,
  },
  arrow: {
    position: 'absolute',
    right: -30,
    top: 50,
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
