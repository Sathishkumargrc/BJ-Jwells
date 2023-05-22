import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  ToastAndroid,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useEffect, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import SoundPlayer from 'react-native-sound-player';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import ImageZoom from 'react-native-image-pan-zoom';
import {useDispatch} from 'react-redux';
import {
  colours,
  style,
  FontSize,
  SALT,
  GET_ITEM_TYPE,
  GET_CATALOG_LIST,
  CREATE_ORDER_URL,
  meltingpointdata,
} from '../../constants';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import ModalComponenet from '../../components/Modal';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';
import {setNewOrderImage} from '../../redux/Slice/user';
import ModalZoom from '../../components/Modal/ModalZoom';
import moment from 'moment';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const NewOrders = props => {
  const nextField = useRef();
  const weightField = useRef();
  const lengthField = useRef();
  const meltingField = useRef();
  const sealField    = useRef();
  const orderField = useRef();
  const commentsField=useRef();
  const route = useRoute();
  const datas = route.params.data1;
  const datas1 = 'value1';
  // const[testData, setTestData] = useState(route.params.data1);

  const dispatch = useDispatch();
  const [viewable, setViewable] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [jewellImage, setJewellImage] = useState('');
  // console.log('jewellImage', jewellImage);
  const [link, setLink] = useState('');
  // console.log('link', typeof link);
  const [loading, setLoading] = useState(false);
  const [dataName, setDataName] = useState('');
  const [audio64, setAudio64] = useState('');
  const focused = useIsFocused();
  const [modalImage, setModalImage] = useState();
  const [audio, setAudio] = useState('');
  const [recordTime,setRecordTime] = useState(0.0);
  // console.log('recordstate', recordTime)
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  const [catalog, setCatalog] = useState('');
  const [Visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const [quantity, setQuantity] = useState('');
  const [stone, setStone] = useState('');
  const [enamel, setEnamel] = useState('');
  const [backchain, setBackchain] = useState('');
  const [rhodium, setRhodium] = useState('');
  const [meltingpoint, setMeltingPoint] = useState('');
  const [hallmark, setHallmark] = useState('');
  const [seal, setSeal] = useState('');
  const [orderby, setOrderby] = useState('');
  const [comments, setComments] = useState('');
  const [model, setModel] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  // console.log('value', value);
  const [items, setItems] = useState([]);
  const stoneData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
    },
  ];
  const enamelData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
    },
  ];
  const backchainData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
    },
  ];
  const rhodiumData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Yes',
      value: 'Yes',
    },
    {
      id: '2',
      label: 'No',
      value: 'No',
    },
  ];
  const [selectedStone, setSelectedStone] = useState(stoneData);
  const [selectedEnamel, setSelectedEnamel] = useState(enamelData);
  const [selectedBackchain, setSelectedBackchain] = useState(backchainData);
  const [selectedRhodium, setSelectedRhodium] = useState(rhodiumData);

  const [size, setSize] = useState('');
  const [sOpen, setSOpen] = useState(false);
  const [sValue, setSValue] = useState([
    {label: 'NO HOOK', value: 'NO HOOK'},
    //   {label: 'S-HOOK', value: 'S-HOOK' },
    //   {label: 'ROUND HOOK', value: 'ROUND HOOK'},
    //  {label: 'W-HOOK', value: 'SIZE'},
  ]);

  const [selected, setSelectedIndex] = useState();
  console.log('selectedIndex', selected);
  const [hook, setHook] = useState('');
  const [hOpen, setHOpen] = useState(false);
  const [hValue, setHValue] = useState([
    {label: 'NO HOOK', value: 'NO HOOK'},
    {label: 'S-HOOK', value: 'S-HOOK'},
    {label: 'ROUND-HOOK', value: 'ROUND-HOOK'},
    {label: 'W-HOOK', value: 'W-HOOK'},
  ]);
  const [image, setImage] = useState('');
  const [imagePath, setImagePath] = useState([]);
  const [isAudioEnable, setIsAudioEnable] = useState(false);

  console.log('imagePath', imagePath);
  const onGalleryImage = async () => {
    try {
      // const res = await DocumentPicker.pickMultiple({
      //   type: [DocumentPicker.types.images],
      // });
      // console.log('log of gallery', res);
      // setImagePath(res);
      // let data = [];
      // res?.map((item, index) => {
      //   console.log({index}, item.uri);
      //   data.push(item.uri);
      // });
      // setImage(data);
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        let image = [];

        // setImagePath(images);
        let data = [];
        images?.map((item, index) => {
          console.log({index}, item.path);
          data.push(item.path);
          image.push({
            uri: item?.path,
            type: item?.mime,
            name: item?.path,
          });
        });
        setImagePath(image);
        setImage(data);
      });
    } catch (err) {
      setImagePath([]);
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        console.log('Gallery Image picker err', err);
      }
    }
  };

  // const onCameraImage = () => {
  //   try {
  //     const options = {
  //       title: 'Select Image',
  //       storageOptions: {
  //         skipBackup: true,
  //         path: 'images',
  //       },
  //     };
  //     launchCamera(options, response => {
  //       console.log('response', response);
  //       if (response.didCancel) {
  //         console.log('usercancel');
  //       } else if (response.error) {
  //         console.log('ImagePicker Error: ', response.error);
  //       } else if (response.customButton) {
  //         console.log('User tapped custom button: ', response.customButton);
  //       } else {
  //         console.log('response', response);
  //       }
  //     });
  //   } catch (err) {
  //     console.log('Camera Image picker err', err);
  //   }
  // };

  useEffect(() => {
    if (datas == datas1) {
      console.log('passed from TestScreen', datas, datas1);
    } else {
      console.log('useeffect', datas1);
      itemType();
      catalogList();
      setCatalog('');
      setWeight('');
      setHeight('');
      setQuantity('');
      setStone('');
      setEnamel('');
      setBackchain('');
      setRhodium('');
      setSelectedStone(stoneData);
      setSelectedEnamel(enamelData);
      setSelectedBackchain(backchainData);
      setSelectedRhodium(rhodiumData);
      setHallmark('');
      setSeal('');
      setOrderby('');
      setComments('');
      setModel('');
      setHook('');
      setImage('');
      setValue(value ? value : '13');
      setLink(link ? link : '13');
      setImagePath([]);
      setSelectedIndex(0);
      setDataName('');
      setAudio('');
      setAudio64('');
      setLoading(false);
      setImagePath([]);
      setModalImage('');
      setSize('NO HOOK');
      setMeltingPoint('');
      setRecordTime('');
    }
  }, [focused]);

  //Audio playing finished or not
  useEffect(() => {
    SoundPlayer.onFinishedPlaying((success: boolean) => {
      setIsAudioEnable(false);
      console.log('>>>>>>>>>>Successfully finished Audio');
    });
  }, []);

  const itemType = () => {
    const auth_token = md5(SALT + user_id);
    const data = {
      user_id: user_id,
      auth_token: auth_token,
    };
    const endpoint = GET_ITEM_TYPE;
    POST_API(endpoint, data)
      .then(res => {
        // console.log('res', res.data);
        setItems(res.data.parameters);
      })
      .catch(err => {
        Toast.show(err);
      });
  };

  const onCameraImage = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Audio Permission',
      message: 'App needs access to your microphone',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    })
      .then(() => {
        let optoins = {
          mediaType: 'photo',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        launchCamera(optoins, res => {
          console.log('res of camer', res);
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.errorCode) {
            console.log('ImagePicker Error: ', res.errorCode);
          } else if (res.customButton) {
            console.log('User tapped custom button: ', res.customButton);
          } else if (res.errorMessage) {
            console.log('ImagePicker Error: ', res.errorMessage);
          } else {
            setImagePath([
              {
                uri: res.assets[0]?.uri ?? res.assets[0]?.image_url,
                type: res.assets[0]?.type,
                name: res.assets[0]?.image_url
                  ? res.assets[0]?.image_url
                  : res.assets[0]?.fileName ?? res.assets[0]?.name,
              },
            ]);

            // setImagePath(res.assets[0]);
            setImage([res.assets[0].uri]);
          }
        });
      })
      .catch(error => {
        console.log(error);
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
        console.log('res of catalog', res.data);
        setCatalog(res.data.parameters);
      })
      .catch(err => {
        Toast.show(err);
      });
  };

  const recordAudio = async () => {
    try {
      if (Platform.OS === 'ios') {
        let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
        AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: 'Medium',
          AudioEncoding: 'aac',
          IncludeBase64: true,
        });
        AudioRecorder.startRecording();
        setIsAudioEnable(true);
        // setAudioClick(true);
        AudioRecorder.onProgress = data => {
          console.log('datarecordis', data);
          console.log('metering',data.currentMetering, data.currentPeakMetering)
          
        };
        Toast.show('Audio Recording');
      } else {
        const grand = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your microphone',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (grand === PermissionsAndroid.RESULTS.GRANTED) {
          let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
          AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: 'Medium',
            AudioEncoding: 'aac',
            IncludeBase64: true,
          });
          AudioRecorder.startRecording();
          // setAudioClick(true);
          AudioRecorder.onProgress = data => {
            console.log('datarecis', data);
           setRecordTime(Math.floor(data.currentTime))
            // setRecordTime(data);
          };
          Toast.show('Audio Recording');
        } else {
          Toast.show('Audio Recording Permission Denied by user');
        }
      }
    } catch (e) {
      Toast.show(e);
      console.log('Audio rec err', e);
    }
  };
  const stopAudio = () => {
    try {
      // SoundRecorder.stop().then(function (result) {
      //   console.log('Audio recorded successfully', result);
      //   if (result.path) {
      //     setAudio(`file://${result.path}`);
      //   }
      //   console.log(
      //     'stopped recording, audio file saved at: ' + `file://${result.path}`,
      //   );
      //   ToastAndroid.show('Audio recorded successfully', ToastAndroid.SHORT);
      // });
      AudioRecorder.onFinished = (error, filePath) => {
        if (error) {
          console.log('Audio Recorder error: ', error);
          setAudio(error.audioFileURL);
          setAudio64(error.base64);
          Toast.show('Audio Recorder Successfully ');
        } else {
          console.log('Audio Recorder filePath: ', filePath);
          setAudio(filePath);
          // setRecordTime({recordTime: Math.floor(data.recordTime)});
          console.log('audpath',filePath)
          Toast.show('Audio Recorder Successfully ');
        }
      };
      AudioRecorder.stopRecording();
      setIsAudioEnable(false);

      SoundPlayer.stop();
    } catch (e) {
      console.log(e);
    }
  };
  console.log('stone', stone);
  function onstoneRadioButton(index) {
    console.log('index of stoe', index);
    setSelectedStone(index);
    // setRadioButtons(radioButtonsArray);
    index.map(item => {
      console.log('item', item);
      item.selected ? setStone('No') : setStone('Yes');
    });
  }

  function onenamelRadioButton(index) {
    console.log('index of enamel', index);
    setSelectedEnamel(index);
    // setRadioButtons(radioButtonsArray);
    index.map(item => {
      item.selected ? setEnamel('No') : setEnamel('Yes');
    });
  }
  function onrhodiumRadioButton(index) {
    console.log('index of rhodium', index);
    setSelectedRhodium(index);
    // setRadioButtons(radioButtonsArray);
    index.map(item => {
      item.selected ? setRhodium('No') : setRhodium('Yes');
    });
  }
  function onbackchainRadioButton(index) {
    console.log('index of backchain', index);
    setSelectedBackchain(index);
    // setRadioButtons(radioButtonsArray);
    index.map(item => {
      item.selected ? setBackchain('No') : setBackchain('Yes');
    });
  }
  const playAudio = async audio => {
    try {
      console.log('audio', audio);
      if (audio) {
        Toast.show('Playing Audio');
        SoundPlayer.playUrl(audio); //await from infront of soundplayer
        console.log('>>>>>>>>loggggg')
        setIsAudioEnable(true);
        // const ios = await SoundPlayer.playUrl(audio);
      } else {
        Toast.show('No Audio Please record the audio first');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async () => {
    
    // console.log('data of new order', recordTime);
    
    setLoading(true);
    // console.log('meltingpoint is', quantity, meltingpoint, orderby);
    if (quantity === '' || meltingpoint === '' || orderby === '' ) {
      Alert.alert('Please fill all the fields correctly');
      setLoading(false);
    } else if (meltingpoint < 75 && meltingpoint > 96) {
      Alert.alert('Melting point must be range between 75-95');
      setLoading(false);
    } else {
      setLoading(true);
      const auth_token = md5(SALT + user_id + value);
      let data = new FormData();
      // console.log(typeof user_id, typeof value);
      // console.log('image path of image', imagePath);
      data.append('user_id', JSON.stringify(user_id));
      data.append('category_id', value);
      if (model !== '' || model == '') {
        data.append('model_name', model);
      }
      if (hook !== '') {
        data.append('hook', hook);
      }
      if (stone !== '') {
        data.append('stone', stone);
      }
      if (enamel !== '') {
        data.append('enamel', enamel);
      }
      if (backchain !== '') {
        data.append('back_chain', backchain);
      }
      if (rhodium !== '') {
        data.append('rhodium', rhodium);
      }
      if (meltingpoint !== '' && meltingpoint > 74 && meltingpoint < 96) {
        data.append('melting_point', meltingpoint);
      }
      // if (meltingpoint !== '') {
      //   data.append('melting_point', meltingpoint);
      // }
      // if (hallmark !== '') {
      //   data.append('hallmark', hallmark);
      // }
      if (seal !== '') {
        data.append('seal', seal);
      }
      if (comments !== '') {
        data.append('comments', comments);
      }
      if (imagePath.length > 0) {
        imagePath.map((item, index) => {
          data.append('image[]', item);
        });
        // {
        //   imagePath.map((item, index) => {
        //     data.append('image', {
        //       uri: item.uri,
        //       type: item.type,
        //     });
        //   });
        // }
      }

      if (audio64 !== '') {
        data.append('voice_note', audio64);
      }
      data.append('auth_token', auth_token);
      if (orderby !== '') {
        data.append('order_by', orderby);
      }
      if (weight !== '') {
        data.append('weight', weight);
      }
      if (height !== '') {
        data.append('length', height);
      }
      if (quantity !== '') {
        data.append('length_metric', size);
      }
      if (quantity !== '') {
        data.append('qty', quantity);
      }
      if (modalImage !== '') {
        data.append('catalog_images', modalImage);
      }

      if(recordTime!==''){
        data.append('voice_duration', recordTime);
      }
      console.log('data of new order', JSON.stringify(data));
      const endpoint = CREATE_ORDER_URL;

      const headers = {'Content-Type': 'multipart/form-data'};
      var requestOptions = {
        method: 'POST',
        headers: headers,
        body: data,
      };
      if (weight == '' || height == '') {
        setLoading(false);
        Alert.alert('please fill weight and length ');
      } else {
        await fetch(endpoint, requestOptions)
          .then(res => res.json())
          .then(res => {
            console.log('res of order creation', res.status);
            if (res.success === false) {
              setLoading(false);
              console.log('error', res);
              // Alert.alert('Melting point must be range between 75-95')
              Alert.alert(res.message);
            } else {
              setLoading(false);
              console.log('success', res);
              Alert.alert(res.message);
              navigation.navigate('AllOrders');
            }
          })
          .catch(err => {
            console.log('err', err);
          });
      }

      // POST_API(endpoint, data)
      //   .then(result => {
      //     console.log('result', result.data);
      //     if (result.data.success) {
      //       // Alert.alert('Order Created Successfully');
      //       navigation.navigate('AllOrders');
      //     } else {
      //       console.log('error', result.data);
      //       //Alert.alert(result.message);
      //     }
      //   })
      //   .catch(err => {
      //     console.log('err of new order', err);
      //     ToastAndroid.show(err, ToastAndroid.SHORT);
      //   });
    }
  };

  return (
    <KeyboardAwareScrollView
      style={style.mainContainer}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <Header>New Orders</Header>
      <View style={{...styles.headingContainer}}>
        <Paragraph style={style.textinputHeading}>Image</Paragraph>
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={styles.imageContainer}>
          {image ? (
            (console.log('image dispaly', imagePath),
            (
              <>
                <ScrollView
                  nestedScrollEnabled={true}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {image.map((item, index) => {
                    console.log('item1', item);
                    return (
                      <View
                        key={index}
                        style={{...styles.viewImage, borderWidth: 0}}>
                        <TouchableOpacity
                          onPress={() => {
                            setViewable(true);
                            setVisible1(true);
                            setJewellImage(item); 
                          }}>
                          <FastImage
                            style={{...styles.image, borderWidth: 0}}
                            source={{
                              uri: item,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
                {viewable ? (
                  <ModalZoom
                    showable={visible1}
                    JewellPhoto={jewellImage}
                    onBackdropPress1={() => {
                      setVisible1(false);
                    }}
                    onBackButtonPress1={() => {
                      setVisible1(false);
                    }}
                  />
                ) : null}

                <View style={styles.imagelenText}>
                  <Paragraph>{image.length}</Paragraph>
                </View>
              </>
            ))
          ) : (
            <Image
              source={require('../../Assets/Image/Placeholder.png')}
              style={styles.image}
            />
          )}
        </View>

        <View style={styles.imagePicker}>
          <TouchableOpacity
            style={styles.imageCon}
            onPress={() => {
              onGalleryImage();
            }}>
            <Ionicons name="image" size={25} color={colours.Black} />
            <Paragraph>Gallery</Paragraph>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageCon}
            onPress={() => {
              setImage('');
              setVisible(true);
            }}>
            <Ionicons name="briefcase" size={25} color={colours.Black} />
            <Paragraph>Catalouge</Paragraph>
          </TouchableOpacity>
          {catalog ? (
            <ModalComponenet
              isVisible={Visible}
              onBackdropPress={() => {
                setVisible(false);
              }}
              data={catalog}
              onImagePress={(item, index) => {
                console.log('imgae', item);
                setImage([item.image_url]);
                setModalImage(item.image_url);
                setVisible(false);
                setImagePath([]);
                setValue(item.category_id);
              }}
              onBackButtonPress={() => {
                setVisible(false);
              }}
              onPress={(item, index) => {
                console.log(item);
                setDataName(item.category_name);
                setLink(item.link);
                setVisible(false);
              }}
            />
          ) : null}
          <TouchableOpacity
            style={styles.imageCon}
            onPress={() => {
              onCameraImage();
            }}>
            <Ionicons name="camera" size={25} color={colours.Black} />
            <Paragraph>Camera</Paragraph>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{...styles.headingContainer}}>
        <Paragraph style={style.textinputHeading}>ITEM TYPE</Paragraph>
        <Paragraph style={styles.mustSymbol}> *</Paragraph>
      </View>

      <View style={{alignItems: 'center'}}>
        {dataName ? (
          <View style={{...styles.textInput, justifyContent: 'center'}}>
            <Paragraph>{dataName}</Paragraph>
          </View>
        ) : (
          <ScrollPicker
            dataSource={items.map((item, index) => item.category_name)}
            selectedIndex={0}
            renderItem={(data, index) => {
              return (
                <View style={styles.pickcontainer}>
                  <Paragraph style={styles.pickerText}>{data}</Paragraph>
                </View>
              );
            }}
            onValueChange={(data, selectedIndex) => {
              console.log('render', data, selectedIndex);
              setValue(items[selectedIndex].category_id);
              setLink(items[selectedIndex].link);
              console.log('Value od image', items[selectedIndex].category_id);
              console.log('render of image', items[selectedIndex].link);
            }}
            wrapperHeight={100}
            wrapperWidth={150}
            wrapperColor="#fff"
            itemHeight={50}
            highlightColor="#000000"
            highlightBorderWidth={2}
          />
        )}
        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>MODEL NAME</Paragraph>
          {/* <Paragraph style={styles.mustSymbol}></Paragraph> */}
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Model Name"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setModel(text);
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            nextField.current.focus();
          }}
          blurOnSubmit={false}
          value={model}
        />

        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>QUANTITY</Paragraph>
          <Paragraph style={styles.mustSymbol}> *</Paragraph>
        </View>
        <TextInput
          style={{...styles.textInput}}
          placeholder="Enter Quantity"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setQuantity(
              text.replace(/[-_@#₹*:!?"';,<>+&%$/\(\)\{\}\[\]\\]/gi, ''),
            );
          }}
          returnKeyType="next"
          onSubmitEditing={() => {
            weightField.current.focus();
          }}
          blurOnSubmit={false}
          ref={nextField}
          value={quantity}
        />
        {/* <View style={{flex: 1}}>
          <Material value={value} />
        </View> */}
        <View style={styles.headingContainer}>
          <Paragraph style={style.textinputHeading}>WEIGHT</Paragraph>
          <Paragraph style={styles.mustSymbol}> *</Paragraph>
        </View>
        <View style={styles.weightInput}>
          <TextInput
            style={{...styles.textInput, width: screenWidth * 0.75}}
            placeholder="Enter Weight"
            keyboardType={
              Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'number-pad'
            }
            placeholderTextColor={colours.Grey}
            onChangeText={text => {
              setWeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
            }}
            returnKeyType="next"
          onSubmitEditing={() => {
            lengthField.current.focus();
          }}
          blurOnSubmit={false}
            ref={weightField}
            value={weight}
            
          />
          <Paragraph style={{...style.headingText, marginTop: 0, fontSize: 16}}>
            Gram
          </Paragraph>
        </View>
        <View style={styles.headingContainer}>
          <Paragraph style={style.textinputHeading}>LENGTH / SIZE</Paragraph>
          <Paragraph style={styles.mustSymbol}> *</Paragraph>
        </View>
        <View style={styles.lengthConatiner}>
          <TextInput
            style={{
              ...styles.textInput,
              width: screenWidth * 0.4,
              marginTop: 0,
            }}
            // keyboardType={
            //   Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'number-pad'
            // }
            placeholder="Enter Length / Size"
            placeholderTextColor={colours.Grey}
            onChangeText={text => {
              // setHeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
              setHeight(text);
            }}
            value={height}
            returnKeyType="next"
          onSubmitEditing={() => {
            meltingField.current.focus();
          }}
          blurOnSubmit={false}
            ref={lengthField}
          />
          {/* <DropDownPicker
                  placeholder="Select Size"
                  nestedScrollEnabled={true}
                  key={Math.random()}
                  open={sOpen}
                  value={size}
                  zIndex={1000}
                  zIndexInverse={5000}
                  items={sValue}
                  setOpen={setSOpen}
                  setValue={setSize}
                  setItems={setSValue}
                  mode="BADGE"
                  containerStyle={{width: screenWidth * 0.4, height: 50}}
                  style={styles.dropDownStyle}
                /> */}
          {/* <ScrollPicker
            dataSource={sValue}
            selectedIndex={0}
            renderItem={(data, index) => {
              return (
                <View style={styles.pickcontainer}>
                  <Paragraph style={styles.pickerText}>{data.label}</Paragraph>
                </View>
              );
            }}
            onValueChange={(data, selectedIndex) => {
              console.log('render', data, selectedIndex);
              setSize(data.value);
              // setSOpen(false);
            }}
            wrapperHeight={100}
            wrapperWidth={150}
            wrapperColor="#fff"
            itemHeight={50}
            highlightColor="#000000"
            highlightBorderWidth={2}
          /> */}
          <View>
            <ScrollPicker
              dataSource={hValue}
              selectedIndex={0}
              renderItem={(data, index) => {
                console.log('data of src', data);
                return (
                  <View style={styles.pickcontainer}>
                    <Paragraph style={styles.pickerText}>
                      {data.label}
                    </Paragraph>
                  </View>
                );
              }}
              onValueChange={(data, selectedIndex) => {
                console.log('render', data.value, selectedIndex);
                setHook(data.value);

                console.log('render of image', items[selectedIndex].link);
              }}
              wrapperHeight={100}
              wrapperWidth={150}
              wrapperColor="#fff"
              itemHeight={50}
              highlightColor="#000000"
              highlightBorderWidth={2}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          {link === '6' ? (
            <View>
              {/* <View style={{ ...styles.headingContainer, paddingLeft: 0 }}>
                <Paragraph style={style.textinputHeading}>HOOK</Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View>
              <ScrollPicker
                dataSource={hValue}
                selectedIndex={0}
                renderItem={(data, index) => {
                  console.log('data of src', data);
                  return (
                    <View style={styles.pickcontainer}>
                      <Paragraph style={styles.pickerText}>
                        {data.label}
                      </Paragraph>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  console.log('render', data.value, selectedIndex);
                  setHook(data.value);

                  console.log('render of image', items[selectedIndex].link);
                }}
                wrapperHeight={100}
                wrapperWidth={150}
                wrapperColor="#fff"
                itemHeight={50}
                highlightColor="#000000"
                highlightBorderWidth={2}
              /> */}

              {/* <DropDownPicker
                    placeholder="Select Hook"
                    nestedScrollEnabled={true}
                    key={Math.random()}
                    zIndexInverse={5000}
                    zIndex={1000}
                    open={hOpen}
                    value={hook}
                    items={hValue}
                    setOpen={setHOpen}
                    setValue={setHook}
                    setItems={setHValue}
                    mode="BADGE"
                    containerStyle={styles.dropDownCon}
                    style={styles.dropDownStyle}
                  /> */}
            </View>
          ) : (
            <>
              {link === '13' ? (
                <></>
              ) : (
                <>
                  {/* <View
                    style={{
                      marginLeft: 0,
                    }}>
                    <View
                      style={{
                        ...styles.headingContainer,
                        paddingLeft: 0,
                      }}>
                      <Paragraph style={style.textinputHeading}>
                        STONE
                      </Paragraph>
                      <Paragraph style={styles.mustSymbol}> *</Paragraph>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <RadioGroup
                        radioButtons={selectedStone}
                        onPress={onstoneRadioButton}
                        layout="row"
                      />
                    </View>
                    <View
                      style={{
                        ...styles.headingContainer,
                        paddingLeft: 0,
                      }}>
                      <Paragraph style={style.textinputHeading}>
                        ENAMEL
                      </Paragraph>
                      <Paragraph style={styles.mustSymbol}> *</Paragraph>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <RadioGroup
                        radioButtons={selectedEnamel}
                        onPress={onenamelRadioButton}
                        layout="row"
                      />
                    </View>
                    <View
                      style={{
                        ...styles.headingContainer,
                        paddingLeft: 0,
                      }}>
                      <Paragraph style={style.textinputHeading}>
                        BACK CHAIN
                      </Paragraph>
                      <Paragraph style={styles.mustSymbol}> *</Paragraph>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <RadioGroup
                        radioButtons={selectedBackchain}
                        onPress={onbackchainRadioButton}
                        layout="row"
                      />
                    </View>
                    <View
                      style={{
                        ...styles.headingContainer,
                        paddingLeft: 0,
                      }}>
                      <Paragraph style={style.textinputHeading}>
                        RHODIUM
                      </Paragraph>
                      <Paragraph style={styles.mustSymbol}> *</Paragraph>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <RadioGroup
                        radioButtons={selectedRhodium}
                        onPress={onrhodiumRadioButton}
                        layout="row"
                      />
                    </View>
                  </View> */}
                </>
              )}
            </>
          )}
        </View>

        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>MELTING POINT</Paragraph>
          <Paragraph style={styles.mustSymbol}> *</Paragraph>
        </View>

        <View>
          <TextInput
            style={{...styles.textInput}}
            placeholder="Enter Melting Point"
            placeholderTextColor={colours.Grey}
            name="meltingPoint"
            onChangeText={value => setMeltingPoint(value)}
            value={meltingpoint}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => {
              commentsField.current.focus();
            }}
            blurOnSubmit={false}
              ref={meltingField}
            ></TextInput>
        </View>
        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>COMMENTS</Paragraph>
        </View>
        <TextInput
          style={styles.commentTextInput}
          placeholder="Enter Comments"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setComments(text);
          }}
          value={comments}
          numberOfLines={5}
          multiline={true}
          returnKeyType="next"
            onSubmitEditing={() => {
              sealField.current.focus();
            }}
            blurOnSubmit={false}
              
    
            ref={commentsField}
        />
        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>VOICE NOTE</Paragraph>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: screenWidth * 0.5,
            marginTop: 30,
          }}>
          <TouchableOpacity
          style={{marginVertical:0}}
            onPress={() => {
              recordAudio();
            }}
            disabled = {isAudioEnable}
            >
            <Image
              source={require('../../Assets/Image/Record.png')}
              style={{
                marginLeft: 10,
              }}
            />
            <Paragraph>Record</Paragraph>
            {recordTime ?<Paragraph>{moment.utc(recordTime*1000).format('HH:mm:ss')}</Paragraph>:
            <Paragraph> </Paragraph>}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              stopAudio();
            }}
              disabled = {isAudioEnable}
            >
            <Image
              source={require('../../Assets/Image/Stop.png')}
              style={{
                width: 25,
                height: 25,
              }}
            />
            <Paragraph style={styles.voiceNoteText}>Stop</Paragraph>
            <Paragraph> </Paragraph>
           
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              playAudio(audio);
            }}
               disabled = {isAudioEnable}
            >
            <Image source={require('../../Assets/Image/Audio.png')} />
            <Paragraph style={styles.voiceNoteText}>Play</Paragraph>
            <Paragraph> </Paragraph>
          </TouchableOpacity>
        </View>

        {/* <View style={{ ...styles.headingContainer }}>
          <Paragraph style={style.textinputHeading}>HALMARK</Paragraph>
        </View>
        <TextInput
          style={{ ...styles.textInput }}
          placeholder="Enter Halmark"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setHallmark(text);
          }}
          value={hallmark}
        /> */}

        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>SEAL</Paragraph>
        </View>
        <TextInput
          style={{...styles.textInput}}
          placeholder="Enter Seal"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setSeal(text);
          }}
          value={seal}

          returnKeyType="next"
          onSubmitEditing={() => {
            orderField.current.focus();
          }}
          blurOnSubmit={false}
            ref={sealField}
        />
        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>ORDER BY</Paragraph>
          <Paragraph style={styles.mustSymbol}> *</Paragraph>
        </View>
        <TextInput
          style={{...styles.textInput}}
          placeholder="Enter Order By"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setOrderby(text);
          }}
          value={orderby}
            ref={orderField}
        />
        
      </View>
      {loading ? (
        <View style={styles.enquireButton}>
          <ActivityIndicator size="small" color={colours.White} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.enquireButton}
          onPress={() => {
            onSubmit();
          }}>
          <Paragraph style={styles.enquireText}>Place Order</Paragraph>
        </TouchableOpacity>
      )}
    </KeyboardAwareScrollView>
  );
};

export default NewOrders;

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 20,
    height: 30,

    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mustSymbol: {
    color: colours.Red,
    marginTop: 5,
    fontSize: FontSize.NormalFontsize,
  },
  imageContainer: {
    marginTop: 10,
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.3,
    borderRadius: 10,
  },
  imageCon: {
    width: 100,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  imagePicker: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  dropDownCon: {
    height: 50,
    width: screenWidth * 0.87,
    marginTop: 10,
    zIndex: 1,
  },
  dropDownStyle: {
    backgroundColor: colours.BorderGrey,
    borderWidth: 0,
    zIndex: 1,
  },
  textInput: {
    width: screenWidth * 0.87,
    height: 50,
    borderRadius: 10,
    backgroundColor: colours.BorderGrey,
    paddingLeft: 10,
    marginTop: 10,
  },
  weightInput: {
    width: screenWidth * 0.87,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  lengthConatiner: {
    width: screenWidth * 0.87,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  valueText: {
    marginTop: 8,
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
  },
  checkContainer: {
    flexDirection: 'row',
  },
  commentTextInput: {
    padding: 10,
    marginTop: '2%',
    width: screenWidth * 0.87,
    backgroundColor: colours.BorderGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
    height: 150,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  enquireButton: {
    marginTop: 25,
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  enquireText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
  },
  pickcontainer1: {
    width: screenWidth * 0.3,
    alignItems: 'center',
    height: 50,
    width: 200,
    borderColor: '#000000',
    borderWidth: 2,
    marginLeft: 30,
    // wrapperHeight={100}
    // wrapperWidth={150}
    // wrapperColor="#fff"
    // itemHeight={50}
    // highlightColor="#000000"
    // highlightBorderWidth={2}
  },
  pickcontainer: {
    width: screenWidth * 0.3,
    alignItems: 'center',
    height: 20,
  },
  imagelenText: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 15,
    height: 18,
    alignItems: 'center',
    backgroundColor: colours.ButtonBlueColor,
    borderRadius: 5,
  },
  images: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  viewImage: {},
});
