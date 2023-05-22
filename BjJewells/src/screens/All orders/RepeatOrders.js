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
import Toast from 'react-native-simple-toast';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {RadioButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import md5 from 'md5';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import SoundPlayer from 'react-native-sound-player';
import DocumentPicker from 'react-native-document-picker';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {
  colours,
  style,
  FontSize,
  SALT,
  GET_ITEM_TYPE,
  GET_CATALOG_LIST,
  CREATE_ORDER_URL,
  GET_ORDER_DETAILS_URL,
  meltingpointdata,
} from '../../constants';
import Header from '../../components/Header';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import ModalComponenet from '../../components/Modal';
import {useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const RepeatOrders = () => {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [audio64, setAudio64] = useState('');
  const [dbimage, setDbimage] = useState('');
  const [editData, setEditData] = useState([]);
  const datas = useRoute().params.data;
  // console.log('datas', datas);
  const [afile, setAfile] = useState(
    editData.voice_note ? editData.voice_note : '',
  );
  const [category, setCategory] = useState('');
  // console.log('category', category);

  const [audio, setAudio] = useState('');

  const [modalImage, setModalImage] = useState('');
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
  const [meltingpoint, setMeltingpoint] = useState('');
  const [hallmark, setHallmark] = useState('');
  const [seal, setSeal] = useState('');
  const [orderby, setOrderby] = useState('');
  const [comments, setComments] = useState('');
  const [model, setModel] = useState(editData.model_name);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    editData.category ? editData.category : null,
  );

  const [items, setItems] = useState([]);
  const [size, setSize] = useState('');
  const [sOpen, setSOpen] = useState(false);
  const [sValue, setSValue] = useState([
    {label: 'Inch', value: 'INCH'},
    {label: 'Size', value: 'SIZE'},
  ]);

  const [hook, setHook] = useState('');
  const [hOpen, setHOpen] = useState(false);
  const [hValue, setHValue] = useState([
    {label: 'NO HOOK', value: 'NO HOOK'},
    {label: 'S-HOOK', value: 'S-HOOK'},
    {label: 'ROUND-HOOK', value: 'ROUND-HOOK'},
    {label: 'W-HOOK', value: 'W-HOOK'},
  ]);

  const [image, setImage] = useState(editData.image ? editData.image : '');
  const [imagePath, setImagePath] = useState([]);
  // const onGalleryImage = () => {
  //   try {
  //     ImagePicker.openPicker({
  //       width: screenWidth * 0.8,
  //       height: screenHeight * 0.3,
  //       cropping: true,
  //       includeBase64: true,
  //     })
  //       .then(image => {
  //         setImage(image);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   } catch (err) {
  //     console.log('Gallery Image picker err', err);
  //   }
  // };
  const onGalleryImage = async () => {
    try {
      // ImagePicker.openPicker({
      //   multiple: true,
      // })
      //   .then(image => {
      //     console.log('image', image);
      //     let data = [];

      //     image.map((img, i) => {
      //       data.push({
      //         uri: img.path,
      //       });
      //     });
      //     console.log('data', data);
      //     setImagePath(data);
      //     setImage(data[0].uri);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // const res = await DocumentPicker.pickMultiple({
      //   type: [DocumentPicker.types.images],
      // });
      // console.log('res', JSON.stringify(res));
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
  //     ImagePicker.openCamera({
  //       width: screenWidth * 0.8,
  //       height: screenHeight * 0.3,
  //       cropping: true,
  //       includeBase64: true,
  //     })
  //       .then(image => {
  //         setImage(image);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   } catch (err) {
  //     console.log('Camera Image picker err', err);
  //   }
  // };
  const onCameraImage = () => {
    let optoins = {
      mediaType: 'photo',
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(optoins, res => {
      if (res.didCancel) {
        // setTPLoad(false);

        console.log('User cancelled image picker');
      } else if (res.error) {
        // setTPLoad(false);

        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        // setTPLoad(false);

        console.log('User tapped custom button: ', res.customButton);
      } else {
        console.log('response', res.assets[0].uri);
        // setImage(res.assets);
        // setImagePath({
        //   uri: res.assets[0].uri,
        // });
        // setImagePath(res.assets[0]);
        setImagePath([
          {
            uri: res.assets[0]?.uri ?? res.assets[0]?.image_url,
            type: res.assets[0]?.type,
            name: res.assets[0]?.image_url
              ? res.assets[0]?.image_url
              : res.assets[0]?.fileName ?? res.assets[0]?.name,
          },
        ]);
        setImage([res.assets[0].uri]);
      }
    });
  };

  useEffect(() => {
    itemType();
    catalogList();
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
        setItems(res.data.parameters);
      })
      .catch(err => {
        Toast.show(err);
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
        AudioRecorder.onProgress = data => {
          console.log('data', data);
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
          AudioRecorder.onProgress = data => {
            console.log('data', data);
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

  const stopAudio = async () => {
    try {
      // SoundRecorder.stop().then(function (result) {
      //   console.log('Audio recorded successfully', result);
      //   if (result.path) {
      //     setAudio(`'file://${result.path}'`);
      //   }
      //   console.log(
      //     'stopped recording, audio file saved at: ' +
      //       `'file://${result.path}'`,
      //   );
      // });
      AudioRecorder.onFinished = (error, filePath) => {
        if (error) {
          console.log('Audio Recorder error: ', error);
          setAudio(error.audioFileURL);
          setAudio64(error.base64);
          Toast.show('Audio Recorder Success ');
        } else {
          console.log('Audio Recorder filePath: ', filePath);
        }
      };
      AudioRecorder.stopRecording();
      SoundPlayer.stop();
    } catch (e) {
      console.log(e);
    }
  };

  const playAudio = async () => {
    try {
      if (audio) {
        Toast.show('Playing Audio');

        await SoundPlayer.playUrl(audio);
      } else {
        Toast.show('NO Audio Please record the audio first');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    apiCall();
  }, [datas]);

  const apiCall = () => {
    try {
      const auth_token = md5(SALT + user_id + datas);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
        order_id: datas,
      };
      const endpoint = GET_ORDER_DETAILS_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            setLink(response.data.parameters.link);
            // console.log('response', response.data);
            setModel(response.data.parameters.model_name);
            setCategory(response.data.parameters.category_id);
            setValue(response.data.parameters.category_id);
            setSize(response.data.parameters.length_metric);
            // setHook(response.data.parameters.hook);
            setStone(response.data.parameters.stone);
            setEnamel(response.data.parameters.enamel);
            setBackchain(response.data.parameters.back_chain);
            setRhodium(response.data.parameters.rhodium);
            setDbimage(response.data.parameters.image);
            setImage(response.data.parameters.image);
            setAudio(response.data.parameters.voice_note);
            setEditData(response.data.parameters);
            setWeight(response.data.parameters.weight);
            setHeight(response.data.parameters.length_value);
            setQuantity(response.data.parameters.qty);
            setComments(response.data.parameters.comments);
            setSeal(response.data.parameters.seal);
            setOrderby(response.data.parameters.order_by);
            setMeltingpoint(response.data.parameters.melting_point);
            setHallmark(response.data.parameters.hallmark);
            if(response.data.parameters.hook !== null){
              setHook(response.data.parameters.hook);}
              else{
                setHook("NO HOOK")
              }
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

  const onSubmit = async () => {
    setLoading(true);
    const auth_token = md5(SALT + user_id + value);

    let data = new FormData();
    if (model !== null || model !== '') {
      data.append('model_name', model);
    }
    if (hook) {
      data.append('hook', hook);
    }
    if (stone) {
      data.append('stone', stone);
    }
    if (enamel) {
      data.append('enamel', enamel);
    }
    if (backchain) {
      data.append('back_chain', backchain);
    }
    if (rhodium) {
      data.append('rhodium', rhodium);
    }
    if (meltingpoint>74 && meltingpoint<96) {
      data.append('melting_point', meltingpoint);
    }
    
    if (hallmark) {
      data.append('hallmark', hallmark);
    }
    if (seal) {
      data.append('seal', seal);
    }
    if (comments) {
      data.append('comments', comments);
    }
    if (imagePath.length > 0) {
      imagePath.map((item, index) => {
        data.append('image[]', item);
      });
    } else {
      data.append('catalog_images', modalImage ? modalImage : dbimage[0]);
    }

    if (audio64) {
      data.append('voice_note', audio64);
    }
    // if (audio) {
    //   data.append('edit_voice_note', audio);
    // }
    data.append('auth_token', auth_token);
    if (orderby) {
      data.append('order_by', orderby);
    }
    if (weight) {
      data.append('weight', weight);
    }
    if (height) {
      data.append('length', height);
    }

    if (quantity) {
      data.append('qty', quantity);
    }

    data.append('user_id', JSON.stringify(user_id));
    data.append('category_id', value);
    console.log('data', data);
    const endpoint = CREATE_ORDER_URL;
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: data,
    })
      .then(response => response.json())
      .then(result => {
        // console.log('result', result);
        if (result.success === false) {
          setLoading(false);
          if (meltingpoint<75 || meltingpoint>95) {
            Alert.alert('Melting point must be range between 75-95');
          }
          else{
          Alert.alert('Error', result.message,);
          }
          // Alert.alert('Error', result.message);
         
        } else {
          setLoading(false);

          Alert.alert('Order Created Successfully');
          navigation.navigate('AllOrders');
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(error);
        console.log('error of repeat order', error);
      });
  };

  return (
    <ScrollView
      style={style.mainContainer}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <Header>Repeat Orders</Header>
      <View style={{...styles.headingContainer}}>
        <Paragraph style={style.textinputHeading}>Image</Paragraph>
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={styles.imageContainer}>
          {image ? (
            <>
              <ScrollView
                nestedScrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {image.map((item, index) => {
                  console.log('item', item);
                  return (
                    <View key={index} style={styles.viewImage}>
                      {/* <Image
                        source={{uri: item}}
                        style={styles.image}
                        resizeMode="contain"
                      /> */}

                      {/* changes...! */}
                      <FastImage
                            style={{...styles.image, borderWidth: 0}}
                            source={{
                              uri: item,
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                    </View>
                  );
                })}
              </ScrollView>
              <View style={styles.imagelenText}>
                <Paragraph>{image.length}</Paragraph>
              </View>
            </>
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
              }}
              onPress={(item, index) => {
                console.log(item);
                setValue(item.category_id);
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
        <DropDownPicker
          nestedScrollEnabled={true}
          key={Math.random()}
          open={open}
          value={value}
          items={items.map((item, index) => ({
            label: item.category_name,
            value: item.category_id,
            key: index,
          }))}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          mode="BADGE"
          containerStyle={styles.dropDownCon}
          style={styles.dropDownStyle}
          placeholderTextColor={colours.Grey}
        />
        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>MODEL NAME</Paragraph>
          {/* <Paragraph style={styles.mustSymbol}> *</Paragraph> */}
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Model Name"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setModel(text);
          }}
          onChange={text => {
            setModel(text);
          }}
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
            setQuantity(text.replace(/[- @#*;,<>\{\}\[\]\\]/gi, ''));
          }}
          value={quantity}
        />
        <View style={{flex: 1}}>
          {link === '3' || link === '7' || link === '13' ? (
            <>
              <View style={{...styles.headingContainer, paddingLeft: 0}}>
                <Paragraph style={style.textinputHeading}>WEIGHT</Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View>
              <View style={styles.weightInput}>
                <TextInput
                  style={{...styles.textInput, width: screenWidth * 0.75}}
                  placeholder="Enter Weight"
                  keyboardType={
                    Platform.OS === 'ios'
                      ? 'numbers-and-punctuation'
                      : 'number-pad'
                  }
                  placeholderTextColor={colours.Grey}
                  textContentType="telephoneNumber"
                  onChangeText={text => {
                    setWeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
                  }}
                  value={weight}
                />
                <Paragraph
                  style={{...style.headingText, marginTop: 0, fontSize: 16}}>
                  Gram
                </Paragraph>
              </View>


              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <View  style={{width:screenWidth*0.4, }}>
              <View style={{...styles.headingContainer,width:'100%',paddingLeft: 0}}>
                <Paragraph style={style.textinputHeading}>
                  LENGTH / SIZE
                </Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View>
              <View style={{...styles.lengthConatiner,width:screenWidth*0.4,}}>
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
                    setHeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
                    // setHeight(text)
                  }}
                  value={height}
                />
                {/* <DropDownPicker
                  placeholder="Select Size"
                  nestedScrollEnabled={true}
                  key={Math.random()}
                  open={sOpen}
                  value={size}
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
                  selectedIndex={sValue.indexOf(size)}
                  renderItem={(data, index) => {
                    return (
                      <View style={styles.pickcontainer}>
                        <Paragraph style={styles.pickerText}>
                          {data.label}
                        </Paragraph>
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

              </View>
              </View>

               <View style= {{width:screenWidth*0.4}} >
              <View
                    style={{
                      ...{...styles.headingContainer,  width:'50%',paddingLeft: 0},
                      paddingLeft: 0,
                    }}>
                    <Paragraph style={style.textinputHeading}>HOOK</Paragraph>
                    <Paragraph style={styles.mustSymbol}> *</Paragraph>
                  </View>
                  <DropDownPicker
                    // placeholder="Select Hook"
                    placeholder={hook}
                    nestedScrollEnabled={true}
                    key={Math.random()}
                    open={hOpen}
                    value={hook}
                    items={hValue}
                    setOpen={setHOpen}
                    setValue={setHook}
                    setItems={setHValue}
                    mode="BADGE"
                    containerStyle={styles.dropDownCon1}
                    style={{...styles.dropDownStyle}}
                   
                  />
            </View>

              </View>




              {/* <View style={{...styles.headingContainer, paddingLeft: 0}}>
                <Paragraph style={style.textinputHeading}>
                  LENGTH / SIZE
                </Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View> */}
              {/* <View style={styles.lengthConatiner}>
                <TextInput
                  style={{
                    ...styles.textInput,
                    // width: screenWidth * 0.4,
                    marginTop: 0,
                  }}
                  keyboardType={
                    Platform.OS === 'ios'
                      ? 'numbers-and-punctuation'
                      : 'number-pad'
                  }
                  placeholder="Enter Length / Size"
                  placeholderTextColor={colours.Grey}
                  onChangeText={text => {
                    setHeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
                  }}
                  value={height}
                /> */}
                {/* <DropDownPicker
                  placeholder="Select Size"
                  nestedScrollEnabled={true}
                  key={Math.random()}
                  open={sOpen}
                  value={size}
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
                  selectedIndex={sValue.indexOf(size)}
                  renderItem={(data, index) => {
                    return (
                      <View style={styles.pickcontainer}>
                        <Paragraph style={styles.pickerText}>
                          {data.label}
                        </Paragraph>
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
              {/* </View> */}
            </>
          ) : (
            <>
              {link === '6' ? (
                <View>
                  <View style={{...styles.headingContainer, paddingLeft: 0}}>
                    <Paragraph style={style.textinputHeading}>WEIGHT</Paragraph>
                    <Paragraph style={styles.mustSymbol}> *</Paragraph>
                  </View>
                  <View style={styles.weightInput}>
                    <TextInput
                      style={{...styles.textInput, width: screenWidth * 0.75}}
                      placeholder="Enter Weight"
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'numbers-and-punctuation'
                          : 'number-pad'
                      }
                      placeholderTextColor={colours.Grey}
                      textContentType="telephoneNumber"
                      onChangeText={text => {
                        setWeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
                      }}
                      value={weight}
                    />
                    <Paragraph
                      style={{
                        ...style.headingText,
                        marginTop: 0,
                        fontSize: 16,
                      }}>
                      Gram
                    </Paragraph>
                  </View>



                  <View style={{flexDirection:'row',justifyContent:'space-around'}}>
              <View  style={{width:screenWidth*0.4}}>
              <View style={{...styles.headingContainer,width:'100%',paddingLeft: 0}}>
                <Paragraph style={style.textinputHeading}>
                  LENGTH / SIZE
                </Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View>
              <View style={{...styles.lengthConatiner,width:screenWidth*0.4}}>
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
                    setHeight(text.replace(/[@#*;,<>\{\}\[\]\\]/gi, ''));
                    // setHeight(text)
                  }}
                  value={height}
                />
                {/* <DropDownPicker
                  placeholder="Select Size"
                  nestedScrollEnabled={true}
                  key={Math.random()}
                  open={sOpen}
                  value={size}
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
                  selectedIndex={sValue.indexOf(size)}
                  renderItem={(data, index) => {
                    return (
                      <View style={styles.pickcontainer}>
                        <Paragraph style={styles.pickerText}>
                          {data.label}
                        </Paragraph>
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

              </View>
              </View>

               <View style= {{width:screenWidth*0.4}} >
              <View
                    style={{
                      ...{...styles.headingContainer,  width:'50%',paddingLeft: 0},
                      paddingLeft: 0,
                    }}>
                    <Paragraph style={style.textinputHeading}>HOOK</Paragraph>
                    <Paragraph style={styles.mustSymbol}> *</Paragraph>
                  </View>
                  <DropDownPicker
                    // placeholder="Select Hook"
                    placeholder={hook}
                    nestedScrollEnabled={true}
                    key={Math.random()}
                    open={hOpen}
                    value={hook}
                    items={hValue}
                    setOpen={setHOpen}
                    setValue={setHook}
                    setItems={setHValue}
                    mode="BADGE"
                    containerStyle={styles.dropDownCon1}
                    style={{...styles.dropDownStyle}}
                   
                  />
            </View>

              </View>











                  {/* <View style={{...styles.headingContainer, paddingLeft: 0}}>
                    <Paragraph style={style.textinputHeading}>
                      LENGTH / SIZE
                    </Paragraph>
                    <Paragraph style={styles.mustSymbol}> *</Paragraph>
                  </View>
                  <View style={styles.lengthConatiner}>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        // width: screenWidth * 0.4,
                        marginTop: 0,
                      }}
                      // keyboardType={
                      //   Platform.OS === 'ios'
                      //     ? 'numbers-and-punctuation'
                      //     : 'number-pad'
                      // }
                      placeholder="Enter Length / Size"
                      placeholderTextColor={colours.Grey}
                      onChangeText={text => {
                        setHeight(
                          text.replace(/[- @#*;,<>\{\}\[\]\\\/]/gi, ''),
                        );
                      }}
                      value={height}
                    /> */}
                    {/* <DropDownPicker
                      placeholder="Select Size"
                      nestedScrollEnabled={true}
                      key={Math.random()}
                      open={sOpen}
                      value={size}
                      items={sValue}
                      setOpen={setSOpen}
                      setValue={setSize}
                      setItems={setSValue}
                      mode="BADGE"
                      containerStyle={{
                        width: screenWidth * 0.4,
                        height: 50,
                      }}
                      style={styles.dropDownStyle}
                    /> */}
                    {/* <ScrollPicker
                      dataSource={sValue}
                      selectedIndex={sValue.indexOf(size)}
                      renderItem={(data, index) => {
                        return (
                          <View style={styles.pickcontainer}>
                            <Paragraph style={styles.pickerText}>
                              {data.label}
                            </Paragraph>
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
                  {/* </View> */}
                  {/* <View
                    style={{
                      ...{...styles.headingContainer, paddingLeft: 0},
                      paddingLeft: 0,
                    }}>
                    <Paragraph style={style.textinputHeading}>HOOK</Paragraph>
                    <Paragraph style={styles.mustSymbol}> *</Paragraph>
                  </View>
                  <DropDownPicker
                    placeholder="Select Hook"
                    nestedScrollEnabled={true}
                    key={Math.random()}
                    open={hOpen}
                    value={hook}
                    items={hValue}
                    setOpen={setHOpen}
                    setValue={setHook}
                    setItems={setHValue}
                    mode="BADGE"
                    containerStyle={styles.dropDownCon}
                    style={styles.dropDownStyle}
                  />   */}
                </View>
              ) : (
                <>
                  {link === '5' ? (
                    <View>
                      <View
                        style={{...styles.headingContainer, paddingLeft: 0}}>
                        <Paragraph style={style.textinputHeading}>
                          WEIGHT
                        </Paragraph>
                        <Paragraph style={styles.mustSymbol}> *</Paragraph>
                      </View>
                      <View style={styles.weightInput}>
                        <TextInput
                          style={{
                            ...styles.textInput,
                            width: screenWidth * 0.75,
                          }}
                          placeholder="Enter Weight"
                          keyboardType={
                            Platform.OS === 'ios'
                              ? 'numbers-and-punctuation'
                              : 'number-pad'
                          }
                          placeholderTextColor={colours.Grey}
                          textContentType="telephoneNumber"
                          onChangeText={text => {
                            setWeight(
                              text.replace(/[@#*;,<>\{\}\[\]\\\/]/gi, ''),
                            );
                          }}
                          value={weight}
                        />
                        <Paragraph
                          style={{
                            ...style.headingText,
                            marginTop: 0,
                            fontSize: 16,
                          }}>
                          Gram
                        </Paragraph>
                      </View>
                      {/* <View
                        style={{...styles.headingContainer, paddingLeft: 0}}>
                        <Paragraph style={style.textinputHeading}>
                          STONE
                        </Paragraph>
                        <Paragraph style={styles.mustSymbol}> *</Paragraph>
                      </View>
                      <RadioButton.Group
                        onValueChange={value => setStone(value)}
                        value={stone}>
                        <View style={styles.checkContainer}>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={stone === 'YES' ? 'checked' : 'unchecked'}
                              value="YES"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>YES</Text>
                          </View>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={stone === 'NO' ? 'checked' : 'unchecked'}
                              value="NO"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>NO</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View
                        style={{...styles.headingContainer, paddingLeft: 0}}>
                        <Paragraph style={style.textinputHeading}>
                          ENAMEL
                        </Paragraph>
                        <Paragraph style={styles.mustSymbol}> *</Paragraph>
                      </View>
                      <RadioButton.Group
                        onValueChange={value => setEnamel(value)}
                        value={enamel}>
                        <View style={styles.checkContainer}>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={
                                enamel === 'YES' ? 'checked' : 'unchecked'
                              }
                              value="YES"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>YES</Text>
                          </View>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={enamel === 'NO' ? 'checked' : 'unchecked'}
                              value="NO"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>NO</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View
                        style={{...styles.headingContainer, paddingLeft: 0}}>
                        <Paragraph style={style.textinputHeading}>
                          BACK CHAIN
                        </Paragraph>
                        <Paragraph style={styles.mustSymbol}> *</Paragraph>
                      </View>
                      <RadioButton.Group
                        onValueChange={value => setBackchain(value)}
                        value={backchain}>
                        <View style={styles.checkContainer}>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={
                                backchain === 'YES' ? 'checked' : 'unchecked'
                              }
                              value="YES"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>YES</Text>
                          </View>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={
                                backchain === 'NO' ? 'checked' : 'unchecked'
                              }
                              value="NO"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>NO</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <View
                        style={{...styles.headingContainer, paddingLeft: 0}}>
                        <Paragraph style={style.textinputHeading}>
                          RHODIUM
                        </Paragraph>
                        <Paragraph style={styles.mustSymbol}> *</Paragraph>
                      </View>
                      <RadioButton.Group
                        onValueChange={value => setRhodium(value)}
                        value={rhodium}>
                        <View style={styles.checkContainer}>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={
                                rhodium === 'YES' ? 'checked' : 'unchecked'
                              }
                              value="YES"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>YES</Text>
                          </View>
                          <View style={styles.checkboxContainer}>
                            <RadioButton
                              status={
                                rhodium === 'NO' ? 'checked' : 'unchecked'
                              }
                              value="NO"
                              color={colours.ButtonBlueColor}
                              uncheckedColor={colours.SpanishGray}
                            />
                            <Text style={styles.valueText}>NO</Text>
                          </View>
                        </View>
                      </RadioButton.Group> */}
                    </View>
                  ) : (
                    <>
                      {link === '7' ||
                      link === '8' ||
                      link === '9' ||
                      link === '10' ||
                      link === '11' ? (
                        <View>
                          <View
                            style={{
                              ...styles.headingContainer,
                              paddingLeft: 0,
                            }}>
                            <Paragraph style={style.textinputHeading}>
                              WEIGHT
                            </Paragraph>
                            <Paragraph style={styles.mustSymbol}> *</Paragraph>
                          </View>
                          <View style={styles.weightInput}>
                            <TextInput
                              style={{
                                ...styles.textInput,
                                width: screenWidth * 0.75,
                              }}
                              placeholder="Enter Weight"
                              keyboardType={
                                Platform.OS === 'ios'
                                  ? 'numbers-and-punctuation'
                                  : 'number-pad'
                              }
                              placeholderTextColor={colours.Grey}
                              textContentType="telephoneNumber"
                              onChangeText={text => {
                                setWeight(
                                  text.replace(/[@#*;,<>\{\}\[\]\\\/]/gi, ''),
                                );
                              }}
                              value={weight}
                            />
                            <Paragraph
                              style={{
                                ...style.headingText,
                                marginTop: 0,
                                fontSize: 16,
                              }}>
                              Gram
                            </Paragraph>
                          </View>
                          {/* <View
                            style={{
                              ...styles.headingContainer,
                              paddingLeft: 0,
                            }}>
                            <Paragraph style={style.textinputHeading}>
                              STONE
                            </Paragraph>
                            <Paragraph style={styles.mustSymbol}> *</Paragraph>
                          </View>
                          <RadioButton.Group
                            onValueChange={value => setStone(value)}
                            value={stone}>
                            <View style={styles.checkContainer}>
                              <View style={styles.checkboxContainer}>
                                <RadioButton
                                  status={
                                    stone === 'YES' ? 'checked' : 'unchecked'
                                  }
                                  value="YES"
                                  color={colours.ButtonBlueColor}
                                  uncheckedColor={colours.SpanishGray}
                                />
                                <Text style={styles.valueText}>YES</Text>
                              </View>
                              <View style={styles.checkboxContainer}>
                                <RadioButton
                                  status={
                                    stone === 'NO' ? 'checked' : 'unchecked'
                                  }
                                  value="NO"
                                  color={colours.ButtonBlueColor}
                                  uncheckedColor={colours.SpanishGray}
                                />
                                <Text style={styles.valueText}>NO</Text>
                              </View>
                            </View>
                          </RadioButton.Group>
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
                          <RadioButton.Group
                            onValueChange={value => setEnamel(value)}
                            value={enamel}>
                            <View style={styles.checkContainer}>
                              <View style={styles.checkboxContainer}>
                                <RadioButton
                                  status={
                                    enamel === 'YES' ? 'checked' : 'unchecked'
                                  }
                                  value="YES"
                                  color={colours.ButtonBlueColor}
                                  uncheckedColor={colours.SpanishGray}
                                />
                                <Text style={styles.valueText}>YES</Text>
                              </View>
                              <View style={styles.checkboxContainer}>
                                <RadioButton
                                  status={
                                    enamel === 'NO' ? 'checked' : 'unchecked'
                                  }
                                  value="NO"
                                  color={colours.ButtonBlueColor}
                                  uncheckedColor={colours.SpanishGray}
                                />
                                <Text style={styles.valueText}>NO</Text>
                              </View>
                            </View>
                          </RadioButton.Group>

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
                          <RadioButton.Group
                            onValueChange={value => setRhodium(value)}
                            value={rhodium}>
                            <View style={styles.checkContainer}>
                              <View style={styles.checkboxContainer}>
                                <RadioButton
                                  status={
                                    rhodium === 'YES' ? 'checked' : 'unchecked'
                                  }
                                  value="YES"
                                  color={colours.ButtonBlueColor}
                                  uncheckedColor={colours.SpanishGray}
                                />
                                <Text style={styles.valueText}>YES</Text>
                              </View>
                              <View style={styles.checkboxContainer}>
                                <RadioButton
                                  status={
                                    rhodium === 'NO' ? 'checked' : 'unchecked'
                                  }
                                  value="NO"
                                  color={colours.ButtonBlueColor}
                                  uncheckedColor={colours.SpanishGray}
                                />
                                <Text style={styles.valueText}>NO</Text>
                              </View>
                            </View>
                          </RadioButton.Group> */}
                        </View>
                      ) : (
                        <>
                          {link === '12' || link === '1' ? (
                            <View>
                              <View
                                style={{
                                  ...styles.headingContainer,
                                  paddingLeft: 0,
                                }}>
                                <Paragraph style={style.textinputHeading}>
                                  WEIGHT
                                </Paragraph>
                                <Paragraph style={styles.mustSymbol}>
                                  {' '}
                                  *
                                </Paragraph>
                              </View>
                              <View style={styles.weightInput}>
                                <TextInput
                                  style={{
                                    ...styles.textInput,
                                    width: screenWidth * 0.75,
                                  }}
                                  placeholder="Enter Weight"
                                  keyboardType={
                                    Platform.OS === 'ios'
                                      ? 'numbers-and-punctuation'
                                      : 'number-pad'
                                  }
                                  placeholderTextColor={colours.Grey}
                                  textContentType="telephoneNumber"
                                  onChangeText={text => {
                                    setWeight(
                                      text.replace(
                                        /[@#*;,<>\{\}\[\]\\\/]/gi,
                                        '',
                                      ),
                                    );
                                  }}
                                  value={weight}
                                />
                                <Paragraph
                                  style={{
                                    ...style.headingText,
                                    marginTop: 0,
                                    fontSize: 16,
                                  }}>
                                  Gram
                                </Paragraph>
                              </View>
                              <View
                                style={{
                                  ...styles.headingContainer,
                                  paddingLeft: 0,
                                }}>
                                <Paragraph style={style.textinputHeading}>
                                  LENGTH / SIZE
                                </Paragraph>
                                <Paragraph style={styles.mustSymbol}>
                                  {' '}
                                  *
                                </Paragraph>
                              </View>
                              <View style={styles.lengthConatiner}>
                                <TextInput
                                  style={{
                                    ...styles.textInput,
                                    // width: screenWidth * 0.4,
                                    marginTop: 0,
                                  }}
                                  // keyboardType={
                                  //   Platform.OS === 'ios'
                                  //     ? 'numbers-and-punctuation'
                                  //     : 'number-pad'
                                  // }
                                  placeholder="Enter Length / Size"
                                  placeholderTextColor={colours.Grey}
                                  onChangeText={text => {
                                    setHeight(
                                      text.replace(
                                        /[@#*;,<>\{\}\[\]\\\/]/gi,
                                        '',
                                      ),
                                    );
                                  }}
                                  value={height}
                                />
                                {/* <DropDownPicker
                                  placeholder="Select Size"
                                  nestedScrollEnabled={true}
                                  key={Math.random()}
                                  open={sOpen}
                                  value={size}
                                  items={sValue}
                                  setOpen={setSOpen}
                                  setValue={setSize}
                                  setItems={setSValue}
                                  mode="BADGE"
                                  containerStyle={{
                                    width: screenWidth * 0.4,
                                    height: 50,
                                  }}
                                  style={styles.dropDownStyle}
                                /> */}
                                {/* <ScrollPicker
                                  dataSource={sValue}
                                  selectedIndex={sValue.indexOf(size)}
                                  renderItem={(data, index) => {
                                    return (
                                      <View style={styles.pickcontainer}>
                                        <Paragraph style={styles.pickerText}>
                                          {data.label}
                                        </Paragraph>
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
                              </View>
                              {/* <View
                                style={{
                                  ...styles.headingContainer,
                                  paddingLeft: 0,
                                }}>
                                <Paragraph style={style.textinputHeading}>
                                  STONE
                                </Paragraph>
                                <Paragraph style={styles.mustSymbol}>
                                  {' '}
                                  *
                                </Paragraph>
                              </View>
                              <RadioButton.Group
                                onValueChange={value => setStone(value)}
                                value={stone}>
                                <View style={styles.checkContainer}>
                                  <View style={styles.checkboxContainer}>
                                    <RadioButton
                                      status={
                                        stone === 'YES'
                                          ? 'checked'
                                          : 'unchecked'
                                      }
                                      value="YES"
                                      color={colours.ButtonBlueColor}
                                      uncheckedColor={colours.SpanishGray}
                                    />
                                    <Text style={styles.valueText}>YES</Text>
                                  </View>
                                  <View style={styles.checkboxContainer}>
                                    <RadioButton
                                      status={
                                        stone === 'NO' ? 'checked' : 'unchecked'
                                      }
                                      value="NO"
                                      color={colours.ButtonBlueColor}
                                      uncheckedColor={colours.SpanishGray}
                                    />
                                    <Text style={styles.valueText}>NO</Text>
                                  </View>
                                </View>
                              </RadioButton.Group>
                              <View
                                style={{
                                  ...styles.headingContainer,
                                  paddingLeft: 0,
                                }}>
                                <Paragraph style={style.textinputHeading}>
                                  ENAMEL
                                </Paragraph>
                                <Paragraph style={styles.mustSymbol}>
                                  {' '}
                                  *
                                </Paragraph>
                              </View>
                              <RadioButton.Group
                                onValueChange={value => setEnamel(value)}
                                value={enamel}>
                                <View style={styles.checkContainer}>
                                  <View style={styles.checkboxContainer}>
                                    <RadioButton
                                      value="YES"
                                      color={colours.ButtonBlueColor}
                                      uncheckedColor={colours.SpanishGray}
                                    />
                                    <Text style={styles.valueText}>YES</Text>
                                  </View>
                                  <View style={styles.checkboxContainer}>
                                    <RadioButton
                                      value="NO"
                                      color={colours.ButtonBlueColor}
                                      uncheckedColor={colours.SpanishGray}
                                    />
                                    <Text style={styles.valueText}>NO</Text>
                                  </View>
                                </View>
                              </RadioButton.Group>

                              <View
                                style={{
                                  ...styles.headingContainer,
                                  paddingLeft: 0,
                                }}>
                                <Paragraph style={style.textinputHeading}>
                                  RHODIUM
                                </Paragraph>
                                <Paragraph style={styles.mustSymbol}>
                                  {' '}
                                  *
                                </Paragraph>
                              </View>
                              <RadioButton.Group
                                onValueChange={value => setRhodium(value)}
                                value={rhodium}>
                                <View style={styles.checkContainer}>
                                  <View style={styles.checkboxContainer}>
                                    <RadioButton
                                      status={
                                        rhodium === 'YES'
                                          ? 'checked'
                                          : 'unchecked'
                                      }
                                      value="YES"
                                      color={colours.ButtonBlueColor}
                                      uncheckedColor={colours.SpanishGray}
                                    />
                                    <Text style={styles.valueText}>YES</Text>
                                  </View>
                                  <View style={styles.checkboxContainer}>
                                    <RadioButton
                                      status={
                                        rhodium === 'NO'
                                          ? 'checked'
                                          : 'unchecked'
                                      }
                                      value="NO"
                                      color={colours.ButtonBlueColor}
                                      uncheckedColor={colours.SpanishGray}
                                    />
                                    <Text style={styles.valueText}>NO</Text>
                                  </View>
                                </View>
                              </RadioButton.Group> */}
                            </View>
                          ) : (
                            <>
                              {link === '2' ? (
                                <View>
                                  <View
                                    style={{
                                      ...styles.headingContainer,
                                      paddingLeft: 0,
                                    }}>
                                    <Paragraph style={style.textinputHeading}>
                                      WEIGHT
                                    </Paragraph>
                                    <Paragraph style={styles.mustSymbol}>
                                      {' '}
                                      *
                                    </Paragraph>
                                  </View>
                                  <View style={styles.weightInput}>
                                    <TextInput
                                      style={{
                                        ...styles.textInput,
                                        width: screenWidth * 0.75,
                                      }}
                                      placeholder="Enter Weight"
                                      keyboardType={
                                        Platform.OS === 'ios'
                                          ? 'numbers-and-punctuation'
                                          : 'number-pad'
                                      }
                                      placeholderTextColor={colours.Grey}
                                      textContentType="telephoneNumber"
                                      onChangeText={text => {
                                        setWeight(
                                          text.replace(
                                            /[@#*;,<>\{\}\[\]\\\/]/gi,
                                            '',
                                          ),
                                        );
                                      }}
                                      value={weight}
                                    />
                                    <Paragraph
                                      style={{
                                        ...style.headingText,
                                        marginTop: 0,
                                        fontSize: 16,
                                      }}>
                                      Gram
                                    </Paragraph>
                                  </View>
                                  <View
                                    style={{
                                      ...styles.headingContainer,
                                      paddingLeft: 0,
                                    }}>
                                    <Paragraph style={style.textinputHeading}>
                                      LENGTH / SIZE
                                    </Paragraph>
                                    <Paragraph style={styles.mustSymbol}>
                                      {' '}
                                      *
                                    </Paragraph>
                                  </View>
                                  <View style={styles.lengthConatiner}>
                                    <TextInput
                                      style={{
                                        ...styles.textInput,
                                        // width: screenWidth * 0.4,
                                        marginTop: 0,
                                      }}
                                      // keyboardType={
                                      //   Platform.OS === 'ios'
                                      //     ? 'numbers-and-punctuation'
                                      //     : 'number-pad'
                                      // }
                                      placeholder="Enter Length / Size"
                                      placeholderTextColor={colours.Grey}
                                      onChangeText={text => {
                                        setHeight(
                                          text.replace(
                                            /[@#*;,<>\{\}\[\]\\\/]/gi,
                                            '',
                                          ),
                                        );
                                      }}
                                      value={height}
                                    />
                                    {/* <DropDownPicker
                                      placeholder="Select Size"
                                      nestedScrollEnabled={true}
                                      key={Math.random()}
                                      open={sOpen}
                                      value={size}
                                      items={sValue}
                                      setOpen={setSOpen}
                                      setValue={setSize}
                                      setItems={setSValue}
                                      mode="BADGE"
                                      containerStyle={{
                                        width: screenWidth * 0.4,
                                        height: 50,
                                      }}
                                      style={styles.dropDownStyle}
                                    /> */}
                                    {/* <ScrollPicker
                                      dataSource={sValue}
                                      selectedIndex={sValue.indexOf(size)}
                                      renderItem={(data, index) => {
                                        return (
                                          <View style={styles.pickcontainer}>
                                            <Paragraph
                                              style={styles.pickerText}>
                                              {data.label}
                                            </Paragraph>
                                          </View>
                                        );
                                      }}
                                      onValueChange={(data, selectedIndex) => {
                                        console.log(
                                          'render',
                                          data,
                                          selectedIndex,
                                        );
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
                                  </View>

                                  {/* <View
                                    style={{
                                      ...styles.headingContainer,
                                      paddingLeft: 0,
                                    }}>
                                    <Paragraph style={style.textinputHeading}>
                                      RHODIUM
                                    </Paragraph>
                                    <Paragraph style={styles.mustSymbol}>
                                      {' '}
                                      *
                                    </Paragraph>
                                  </View>
                                  <RadioButton.Group
                                    onValueChange={value => setRhodium(value)}
                                    value={rhodium}>
                                    <View style={styles.checkContainer}>
                                      <View style={styles.checkboxContainer}>
                                        <RadioButton
                                          status={
                                            rhodium === 'YES'
                                              ? 'checked'
                                              : 'unchecked'
                                          }
                                          value="YES"
                                          color={colours.ButtonBlueColor}
                                          uncheckedColor={colours.SpanishGray}
                                        />
                                        <Text style={styles.valueText}>
                                          YES
                                        </Text>
                                      </View>
                                      <View style={styles.checkboxContainer}>
                                        <RadioButton
                                          status={
                                            rhodium === 'NO'
                                              ? 'checked'
                                              : 'unchecked'
                                          }
                                          value="NO"
                                          color={colours.ButtonBlueColor}
                                          uncheckedColor={colours.SpanishGray}
                                        />
                                        <Text style={styles.valueText}>NO</Text>
                                      </View>
                                    </View>
                                  </RadioButton.Group> */}
                                </View>
                              ) : (
                                <>
                                  {link === '4' ? (
                                    <View>
                                      <View
                                        style={{
                                          ...styles.headingContainer,
                                          paddingLeft: 0,
                                        }}>
                                        <Paragraph
                                          style={style.textinputHeading}>
                                          WEIGHT
                                        </Paragraph>
                                        <Paragraph style={styles.mustSymbol}>
                                          {' '}
                                          *
                                        </Paragraph>
                                      </View>
                                      <View style={styles.weightInput}>
                                        <TextInput
                                          style={{
                                            ...styles.textInput,
                                            width: screenWidth * 0.75,
                                          }}
                                          placeholder="Enter Weight"
                                          keyboardType={
                                            Platform.OS === 'ios'
                                              ? 'numbers-and-punctuation'
                                              : 'number-pad'
                                          }
                                          placeholderTextColor={colours.Grey}
                                          textContentType="telephoneNumber"
                                          onChangeText={text => {
                                            setWeight(
                                              text.replace(
                                                /[@#*;,<>\{\}\[\]\\\/]/gi,
                                                '',
                                              ),
                                            );
                                          }}
                                          value={weight}
                                        />
                                        <Paragraph
                                          style={{
                                            ...style.headingText,
                                            marginTop: 0,
                                            fontSize: 16,
                                          }}>
                                          Gram
                                        </Paragraph>
                                      </View>
                                      <View
                                        style={{
                                          ...styles.headingContainer,
                                          paddingLeft: 0,
                                        }}>
                                        <Paragraph
                                          style={style.textinputHeading}>
                                          LENGTH / SIZE
                                        </Paragraph>
                                        <Paragraph style={styles.mustSymbol}>
                                          {' '}
                                          *
                                        </Paragraph>
                                      </View>
                                      <View style={styles.lengthConatiner}>
                                        <TextInput
                                          style={{
                                            ...styles.textInput,
                                            // width: screenWidth * 0.4,
                                            marginTop: 0,
                                          }}
                                          // keyboardType={
                                          //   Platform.OS === 'ios'
                                          //     ? 'numbers-and-punctuation'
                                          //     : 'number-pad'
                                          // }
                                          // placeholder="Enter Length / Size"
                                          placeholderTextColor={colours.Grey}
                                          onChangeText={text => {
                                            setHeight(
                                              text.replace(
                                                /[@#*;,<>\{\}\[\]\\\/]/gi,
                                                '',
                                              ),
                                            );
                                          }}
                                          value={height}
                                        />
                                        {/* <DropDownPicker
                                          placeholder="Select Size"
                                          nestedScrollEnabled={true}
                                          key={Math.random()}
                                          open={sOpen}
                                          value={size}
                                          items={sValue}
                                          setOpen={setSOpen}
                                          setValue={setSize}
                                          setItems={setSValue}
                                          mode="BADGE"
                                          containerStyle={{
                                            width: screenWidth * 0.4,
                                            height: 50,
                                          }}
                                          style={styles.dropDownStyle}
                                        /> */}
                                        {/* <ScrollPicker
                                          dataSource={sValue}
                                          selectedIndex={sValue.indexOf(size)}
                                          renderItem={(data, index) => {
                                            return (
                                              <View
                                                style={styles.pickcontainer}>
                                                <Paragraph
                                                  style={styles.pickerText}>
                                                  {data.label}
                                                </Paragraph>
                                              </View>
                                            );
                                          }}
                                          onValueChange={(
                                            data,
                                            selectedIndex,
                                          ) => {
                                            console.log(
                                              'render',
                                              data,
                                              selectedIndex,
                                            );
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
                                      </View>
                                      {/* <View
                                        style={{
                                          ...styles.headingContainer,
                                          paddingLeft: 0,
                                        }}>
                                        <Paragraph
                                          style={style.textinputHeading}>
                                          STONE
                                        </Paragraph>
                                        <Paragraph style={styles.mustSymbol}>
                                          {' '}
                                          *
                                        </Paragraph>
                                      </View>
                                      <RadioButton.Group
                                        onValueChange={value => setStone(value)}
                                        value={stone}>
                                        <View style={styles.checkContainer}>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                stone === 'YES'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="YES"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              YES
                                            </Text>
                                          </View>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                stone === 'NO'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="NO"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              NO
                                            </Text>
                                          </View>
                                        </View>
                                      </RadioButton.Group>
                                      <View
                                        style={{
                                          ...styles.headingContainer,
                                          paddingLeft: 0,
                                        }}>
                                        <Paragraph
                                          style={style.textinputHeading}>
                                          ENAMEL
                                        </Paragraph>
                                        <Paragraph style={styles.mustSymbol}>
                                          {' '}
                                          *
                                        </Paragraph>
                                      </View>
                                      <RadioButton.Group
                                        onValueChange={value =>
                                          setEnamel(value)
                                        }
                                        value={enamel}>
                                        <View style={styles.checkContainer}>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                enamel === 'YES'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="YES"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              YES
                                            </Text>
                                          </View>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                enamel === 'NO'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="NO"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              NO
                                            </Text>
                                          </View>
                                        </View>
                                      </RadioButton.Group>
                                      <View
                                        style={{
                                          ...styles.headingContainer,
                                          paddingLeft: 0,
                                        }}>
                                        <Paragraph
                                          style={style.textinputHeading}>
                                          BACK CHAIN
                                        </Paragraph>
                                        <Paragraph style={styles.mustSymbol}>
                                          {' '}
                                          *
                                        </Paragraph>
                                      </View>
                                      <RadioButton.Group
                                        onValueChange={value =>
                                          setBackchain(value)
                                        }
                                        value={backchain}>
                                        <View style={styles.checkContainer}>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                backchain === 'YES'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="YES"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              YES
                                            </Text>
                                          </View>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                backchain === 'NO'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="NO"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              NO
                                            </Text>
                                          </View>
                                        </View>
                                      </RadioButton.Group>
                                      <View
                                        style={{
                                          ...styles.headingContainer,
                                          paddingLeft: 0,
                                        }}>
                                        <Paragraph
                                          style={style.textinputHeading}>
                                          RHODIUM
                                        </Paragraph>
                                        <Paragraph style={styles.mustSymbol}>
                                          {' '}
                                          *
                                        </Paragraph>
                                      </View>
                                      <RadioButton.Group
                                        onValueChange={value =>
                                          setRhodium(value)
                                        }
                                        value={rhodium}>
                                        <View style={styles.checkContainer}>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                rhodium === 'YES'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="YES"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              YES
                                            </Text>
                                          </View>
                                          <View
                                            style={styles.checkboxContainer}>
                                            <RadioButton
                                              status={
                                                rhodium === 'NO'
                                                  ? 'checked'
                                                  : 'unchecked'
                                              }
                                              value="NO"
                                              color={colours.ButtonBlueColor}
                                              uncheckedColor={
                                                colours.SpanishGray
                                              }
                                            />
                                            <Text style={styles.valueText}>
                                              NO
                                            </Text>
                                          </View>
                                        </View>
                                      </RadioButton.Group> */}
                                    </View>
                                  ) : null}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>

        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>MELTING POINT</Paragraph>
          <Paragraph style={styles.mustSymbol}> *</Paragraph>
        </View>

        <View >
              <TextInput style={{...styles.textInput}}
          placeholder="Enter Melting Point"
          placeholderTextColor={colours.Grey}
                    name="meltingPoint"
                    onChangeText={(value)=>setMeltingpoint(value)}
                    value={meltingpoint}
                    keyboardType="numeric"></TextInput>
              </View>

        {/* <ScrollPicker
          dataSource={meltingpointdata}
          selectedIndex={meltingpointdata.findIndex(
            item => item.value === meltingpoint,
          )}
          value={meltingpoint}
          renderItem={(data, index) => {
            return (
              <View style={styles.pickcontainer}>
                <Paragraph style={styles.pickerText}>{data}</Paragraph>
              </View>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            console.log('render', data, selectedIndex);
            setMeltingpoint(data);
          }}
          wrapperHeight={100}
          wrapperWidth={150}
          wrapperColor="#fff"
          itemHeight={50}
          highlightColor="#000000"
          highlightBorderWidth={2}
        /> */}

        {/* <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>HALMARK</Paragraph>
        </View>
        <TextInput
          style={{...styles.textInput}}
          placeholder="Enter Halmark"
          keyboardType="numeric"
          placeholderTextColor={colours.Grey}
          onChangeText={text => {
            setHallmark(text);
          }}
          value={hallmark}
        /> */}

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
        />
        <View style={{...styles.headingContainer}}>
          <Paragraph style={style.textinputHeading}>VOICE NOTE</Paragraph>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: screenWidth * 0.5,
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              recordAudio();
            }}>
            <Image source={require('../../Assets/Image/Record.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              stopAudio();
            }}>
            <Image
              source={require('../../Assets/Image/Stop.png')}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              playAudio();
            }}>
            <Image source={require('../../Assets/Image/Audio.png')} />
          </TouchableOpacity>
        </View>
 




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
          <Paragraph style={styles.enquireText}>Repeat Order</Paragraph>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default RepeatOrders;

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
    width: '90%',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  dropDownCon: {
    height: 50,
    width: screenWidth * 0.87,
    marginTop: 10,
  },
  dropDownCon1: {
    height: 50,
    width: screenWidth * 0.36,
    marginTop: 10,
  },
  dropDownStyle: {
    backgroundColor: colours.BorderGrey,
    borderWidth: 0,
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
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
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
  viewImage: {
    width: screenWidth,
    height: screenHeight,
  },
});
