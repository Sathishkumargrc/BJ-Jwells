import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import moment from 'moment';
import ShareIcon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import md5 from 'md5';
import {useSelector} from 'react-redux';
import SoundPlayer from 'react-native-sound-player';
import Modal from 'react-native-modal';
import {POST_API} from '../../api/POST';
import {
  colours,
  style,
  FontSize,
  GET_ORDER_DETAILS_URL,
  SALT,
} from '../../constants';
import Paragraph from '../../components/Paragraph';
import Header from '../../components/Header';
import OrderStatus from '../../components/OrderStatus';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setFcmToken, setImage} from '../../redux/Slice/user';
import ViewShot from 'react-native-view-shot';
import {useCallback} from 'react';
import Share from 'react-native-share';
import {current} from '@reduxjs/toolkit';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [value, setValue] = useState('0');
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const focused = useIsFocused();
  const datas = useRoute().params.data;
  const route = useRoute().params.routeName;
  // console.log('route od order states', route);
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const role = userid.parameters.user_data.role;
  // console.log('role', role);

  const ref = useRef();
  var RNFS = require('react-native-fs');

  useEffect(() => {
    setData([]);
    apiCall();
  }, [focused]);

  const apiCall = () => {
    try {
      const auth_token = md5(SALT + user_id + datas);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        order_id: datas,
      };
      // console.log('data of orderrrrrrrr', data);
      const endpoint = GET_ORDER_DETAILS_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            setValue('1');
            setData(response.data.parameters);
            // console.log('OrderStatus', response.data.parameters);
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('order status error', error);
    }
  };

  const playSound = (voice, admin_voice) => {
    console.log('voice', voice);
    console.log('admin_voice', admin_voice);
    try {
      if (role === 'CUSTOMER') {
        if (
          voice === null ||
          voice === 'https://sriibjjewels.in/admin/web/images/audio/'
        ) {
          Toast.show('No voice available');
        } else {
          Toast.show('Playing voice');

          SoundPlayer.playUrl(voice);
          let time24 = SoundPlayer.getInfo();
          // let time24 =SoundPlayer.getInfo(currentTime)
          console.log(time24);
        }
      } else if (role === 'WORKSTATION') {
        if (
          admin_voice === null ||
          admin_voice === 'https://sriibjjewels.in/admin/web/images/audio/'
        ) {
          if (
            voice === null ||
            voice === 'https://sriibjjewels.in/admin/web/images/audio/'
          ) {
            Toast.show('No voice available');
          } else {
            Toast.show('Playing voice');

            SoundPlayer.playUrl(voice);
            getInfo();
          }
        } else {
          Toast.show('Playing voice');

          SoundPlayer.playUrl(admin_voice);
        }
      }
    } catch (error) {
      console.log('cannot play the song file', error);
    }
  };

  const stopSound = voice => {
    try {
      if (
        voice === 'https://sriibjjewels.in/admin/web/images/audio/' ||
        voice === null
      ) {
        Toast.show('No voice available');
      } else {
        Toast.show('Stopping voice');

        SoundPlayer.stop();
      }
    } catch (error) {
      console.log('cannot play the song file', e);
    }
  };

  const capture = useCallback(() => {
    ref.current.capture().then(uri => {
      console.log('do something', uri);
      RNFS.readFile(uri, 'base64').then(res => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'Share via',
          message: 'Order Details',
          url: urlString,
          type: 'image/jpeg',
        };
        Share.open(options)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      });
    });
  }, []);

  // const getInfo = async ()=>{
  //   const info = await SoundPlayer.getInfo()
  //                console.log('voicetimeis', info)
  // }
  const getInfo = async () => {
    try {
      const info = await SoundPlayer.getInfo(); // Also, you need to await this because it is async
      // console.log('getInfo', info) // {duration: 12.416, currentTime: 7.691}
    } catch (e) {
      console.log('There is no song playing', e);
    }
  };
  // const seek = (seconds)=>{
  //   // let time2 = SoundPlayer.seek(seconds)
  //   console.log('recordtime22',seconds)
  // }

  // const captureAndShareScreenshot =useCallback(uri => {
  //   console.log("do something with ", uri);
  // }, []);

  return (
    <ScrollView
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
      style={style.mainContainer}
      showsVerticalScrollIndicator={false}>
      <Header route={route}>Order Details</Header>

      <View style={styles.filter}>
        <View style={styles.filterContainer}>
          <OrderStatus status={data.status} />
        </View>
      </View>
      <ViewShot
        style={styles.viewshotContainer}
        ref={ref}
        options={{format: 'png', quality: 0.9}}>
        <View>
          <View style={{alignItems: 'center'}}>
            <View style={styles.orderContainer}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  {data.image ? (
                    <TouchableOpacity
                      onPress={() => {
                        console.log('dataimage', data.image);
                        dispatch(setImage(data.image));
                        navigation.navigate('Image');
                      }}>
                      <Image
                        source={{uri: data.image[0]}}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 10,
                          resizeMode: 'cover',
                        }}
                      />
                      <View style={styles.imagelenText}>
                        <Paragraph>{data.image.length}</Paragraph>
                      </View>
                    </TouchableOpacity>
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
                </View>
                <View style={{marginLeft: 20}}>
                  {data.ref_no ? (
                    <Paragraph style={styles.headingTextCopy}>
                      Order No: {data.ref_no}
                    </Paragraph>
                  ) : (
                    <Paragraph style={styles.headingTextCopy}>
                      Order No: --
                    </Paragraph>
                  )}
                  {data.category ? (
                    <Paragraph style={styles.modelText}>
                      {data.category}
                    </Paragraph>
                  ) : (
                    <Paragraph style={styles.modelText}>--</Paragraph>
                  )}
                  {data.weight ? (
                    <Paragraph style={styles.headingTextCopy}>
                      Weight: {data.weight} GRAM
                    </Paragraph>
                  ) : (
                    <Paragraph style={styles.headingTextCopy}>
                      Weight: --
                    </Paragraph>
                  )}
                  {data.length_value ? (
                    <Paragraph style={styles.headingTextCopy}>
                      Length/Size: {data.length_value}
                    </Paragraph>
                  ) : (
                    <Paragraph style={styles.headingTextCopy}>
                      Length/Size: --
                    </Paragraph>
                  )}
                </View>
                <TouchableOpacity style={styles.shareButton} onPress={capture}>
                  <ShareIcon name="share-square-o" size={25} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <View style={styles.continer}>
              <Paragraph>Model Name</Paragraph>
              <Paragraph style={styles.modelText}>{data.model_name}</Paragraph>
            </View>
            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Melting Point</Paragraph>
              <Paragraph style={styles.modelText}>
                {data.melting_point}
              </Paragraph>
            </View>
            {/* <View style={{ ...styles.continer, marginTop: 20 }}>
              <Paragraph>Hall Mark</Paragraph>
              {data.hallmark ? (
                <Paragraph style={styles.modelText}>{data.hallmark}</Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>NO HOOK</Paragraph>
              )}
            </View> */}
            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Seal</Paragraph>
              {data.seal ? (
                <Paragraph style={styles.modelText}>{data.seal}</Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>

            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Hook :</Paragraph>
              {data.hook ? (
                <Paragraph style={styles.modelText}>{data.hook}</Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>NO HOOK</Paragraph>
              )}
            </View>
          </View>
          {/* <View style={{ alignItems: 'center' }}>
            <View style={styles.materialCon}>
              <View style={styles.materialConatainer}>
                <View style={{ ...styles.continer, marginTop: 10, width: '100%' }}>
                  <Paragraph>Stone :</Paragraph>
                  {data.stone ? (
                    <Paragraph style={styles.modelText}>{data.stone}</Paragraph>
                  ) : (
                    <Paragraph style={styles.modelText}>--</Paragraph>
                  )}
                </View>
                <View style={{ ...styles.continer, marginTop: 10, width: '100%' }}>
                  <Paragraph>Enamel :</Paragraph>
                  {data.enamel ? (
                    <Paragraph style={styles.modelText}>{data.enamel}</Paragraph>
                  ) : (
                    <Paragraph style={styles.modelText}>--</Paragraph>
                  )}
                </View>
                
                <View style={{ ...styles.continer,  marginTop: 10, width:"100%"}}>
                  <Paragraph>Hook :</Paragraph>
                  {data.hook ? (
                    <Paragraph style={styles.modelText}>{data.hook}</Paragraph>
                  ) : (
                    <Paragraph style={styles.modelText}>--</Paragraph>
                  )}
                </View>
  
              </View>
              <View style={styles.materialConatainer}>
                <View style={{ ...styles.continer, marginTop: 10, width: '100%' }}>
                  <Paragraph>Back Chain : </Paragraph>
                  {data.back_chain ? (
                    <Paragraph style={styles.modelText}>
                      {data.back_chain}
                    </Paragraph>
                  ) : (
                    <Paragraph style={styles.modelText}>--</Paragraph>
                  )}
                </View>
                <View style={{ ...styles.continer, marginTop: 10, width: '100%' }}>
                  <Paragraph>Rhodium : </Paragraph>
                  {data.rhodium ? (
                    <Paragraph style={styles.modelText}>{data.rhodium}</Paragraph>
                  ) : (
                    <Paragraph style={styles.modelText}>--</Paragraph>
                  )}
                </View>
              </View>
            </View>
          </View> */}
          <View style={{alignItems: 'center', marginTop: 20}}>
            <View style={styles.continer}>
              <Paragraph>Quantity</Paragraph>
              {data.qty ? (
                <Paragraph style={styles.modelText}>{data.qty}</Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>

            {/* <View style={styles.continer}> */}
            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Comments</Paragraph>
            </View>
            <View style={styles.continer}>
              {role === 'CUSTOMER' ? (
                data.comments ? (
                  <Paragraph style={styles.modelText}>
                    {data.comments}
                  </Paragraph>
                ) : (
                  <Paragraph style={styles.modelText}>--</Paragraph>
                )
              ) : null}
              {role === 'WORKSTATION' ? (
                data.comments ? (
                  <Paragraph style={styles.modelText}>
                    {data.comments}
                  </Paragraph>
                ) : (
                  <Paragraph style={styles.modelText}>--</Paragraph>
                )
              ) : null}
            </View>
            <View style={{alignItems: 'center', marginTop: 20}}>
              <View style={styles.continer}>
                <Paragraph>Voice Note</Paragraph>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{...styles.audioContainer, marginTop: 10}}
                  onPress={() => {
                    playSound(data.voice_note, data.admin_voice_note);
                    // getInfo();
                    // seek()
                  }}>
                  <Image
                    source={require('../../Assets/Image/Audio.png')}
                    style={{width: 25, height: 25}}
                  />
                  <Paragraph>
                    {moment.utc(data.voice_duration * 1000).format('HH:mm:ss')}
                  </Paragraph>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.audioContainer}}
                  onPress={() => {
                    stopSound(data.voice_note);
                  }}>
                  <Image
                    source={require('../../Assets/Image/Stop.png')}
                    style={{width: 25, height: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Order By</Paragraph>
              {data.order_by ? (
                <Paragraph style={styles.modelText}>{data.order_by}</Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>
            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Ordered Date</Paragraph>
              {data.ordered_date ? (
                <Paragraph style={styles.modelText}>
                  {data.ordered_date}
                </Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>

            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Ordered Time</Paragraph>
              {data.ordered_time ? (
                <Paragraph style={styles.modelText}>
                  {moment(data.ordered_time, ['HH.mm']).format('hh:mm a')}
                </Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>

            <View style={{...styles.continer, marginTop: 20}}>
              <Paragraph>Deleivered Date</Paragraph>
              {data.delivered_date ? (
                <Paragraph style={styles.modelText}>
                  {data.delivered_date}
                </Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>
            <View
              style={{
                ...styles.continer,
                marginVertical: 30,
                transform: [{translateY: -10}],
              }}>
              <Paragraph>Delivered Time</Paragraph>
              {data.delivered_time ? (
                <Paragraph style={styles.modelText}>
                  {moment(data.delivered_time, ['HH.mm']).format('hh:mm a')}
                </Paragraph>
              ) : (
                <Paragraph style={styles.modelText}>--</Paragraph>
              )}
            </View>
          </View>
          {/* <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View style={styles.continer}>
              <Paragraph>Comments</Paragraph>
            </View>
            <View style={styles.continer}>
              {role === 'CUSTOMER' ? (
                data.comments ? (
                  <Paragraph style={styles.modelText}>{data.comments}</Paragraph>
                ) : (
                  <Paragraph style={styles.modelText}>--</Paragraph>
                )
              ) : null}
              {role === 'WORKSTATION' ? (
                data.comments ? (
                  <Paragraph style={styles.modelText}>{data.comments}</Paragraph>
                ) : (
                  <Paragraph style={styles.modelText}>--</Paragraph>
                )
              ) : null}
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View style={styles.continer}>
              <Paragraph>Voice Note</Paragraph>
            </View>
            <View style={{ flexDirection: 'row',borderWidth:1  }}>
              <TouchableOpacity
                style={{...styles.audioContainer,marginTop:10}}
                onPress={() => {
                  playSound(data.voice_note, data.admin_voice_note);
                  // getInfo();
                  // seek()
                }}>
                <Image
                  source={require('../../Assets/Image/Audio.png')}
                  style={{ width: 25, height: 25, }}
                />
                <Paragraph>{moment.utc(data.voice_duration*1000).format('HH:mm:ss')}</Paragraph>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.audioContainer}}
                onPress={() => {
                  stopSound(data.voice_note);
                }}>
                <Image
                  source={require('../../Assets/Image/Stop.png')}
                  style={{ width: 25, height: 25, }}
                />
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ViewShot>
    </ScrollView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    height: 35,
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
    height: screenHeight * 0.15,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  viewshotContainer: {
    backgroundColor: colours.White,
  },
  shareButton: {
    marginLeft: 40,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  line: {
    borderBottomWidth: 1,
    marginTop: 5,
    borderColor: colours.SnowGrey,
  },
  modelText: {
    ...style.headingText,
    marginTop: 0,
    fontSize: 15,
  },
  continer: {
    width: screenWidth * 0.87,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialConatainer: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialCon: {
    width: screenWidth * 0.93,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioContainer: {
    width: screenWidth * 0.2,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.White,
    marginBottom: 20,
  },
  imagelenText: {
    position: 'absolute',
    right: 4,
    bottom: 4,
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
