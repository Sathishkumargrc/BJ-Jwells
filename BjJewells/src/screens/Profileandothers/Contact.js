import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Linking,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import md5 from 'md5';
import {useSelector, useDispatch} from 'react-redux';

import Toast from 'react-native-simple-toast';
import {
  style,
  FontSize,
  colours,
  GET_COMPANY_URL,
  DELETE_URL,
  SALT,
} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {setUser} from '../../redux/Slice/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Contact = () => {
  const onPressMobileNumberClick = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };
  const navigation = useNavigation();

  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;
  console.log('user_id', user_id);

  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apicall();
    navigation.closeDrawer();
  }, []);

  const apicall = () => {
    try {
      const auth_token = md5(SALT + user_id);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
      };
      const endpoint = GET_COMPANY_URL;
      POST_API(endpoint, data)
        .then(response => {
          if (response.data.success) {
            setContact(response.data.parameters.contact_details);
            setValue(response.data.parameters);
            console.log('contactus', response.data.parameters);
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('Contact', error);
    }
  };

  const showAlert = () => {
    Alert.alert('Delete Account', 'Are you sure want to delete account?', [
      {
        text: 'No',
        onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => deleteAccount(),
        style: 'cancel',
      },
    ]);
  };

  const deleteAccount = () => {
    console.log('yes delete account');
    try {
      const auth_token = md5(SALT + user_id);
      const data = {
        user_id: user_id,
        auth_token: auth_token,
      };
      console.log('deletedata', data);
      const endpoint = DELETE_URL;
      POST_API(endpoint, data)
        .then(res => {
          if (res.data.success) {
            deleteStorage();
          } else {
            Toast.show('account not deleted');
            console.log('Delete error', res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log('Deleteerr', err);
    }
  };
  const deleteStorage = async () => {
    await AsyncStorage.removeItem('@user_id');
    dispatch(setUser(''));
    console.log('delete data', res.data);
    Toast.show('account deleted Successfully');
    alert('deleted');
  };

  const loadInBrowser = web => {
    // console.log('web', web);
    Linking.openURL(`http://${web}`).catch(err => Toast.show(err));
  };

  const {width} = useWindowDimensions();
  const source = {
    html: `${value.contact_terms}`,
  };

  return (
    <SafeAreaView style={{...style.mainContainer, paddingTop: 0}}>
      <ScrollView
        style={{...style.mainContainer, paddingTop: 0}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../../Assets/Image/Back.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Paragraph style={styles.header}>Contact Us</Paragraph>
          <Paragraph style={styles.enqText}>
            Contact us for any help at anytime.
          </Paragraph>
        </View>
        {contact.map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.textContainer}>
                <Paragraph style={style.textinputHeading}>NAME</Paragraph>
                <View style={styles.detailText}>
                  <Paragraph>{item.name}</Paragraph>
                </View>
              </View>
              <TouchableOpacity
                style={styles.textContainer}
                onPress={() => {
                  onPressMobileNumberClick(item.mobile);
                }}>
                <Paragraph style={style.textinputHeading}>
                  MOBILE NUMBER
                </Paragraph>
                <View style={styles.detailText}>
                  <Paragraph>{item.mobile}</Paragraph>
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
          );
        })}
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => Linking.openURL('mailto:admin@gamil.com')}>
          <Paragraph style={style.textinputHeading}>EMAIL ID</Paragraph>
          <View style={styles.detailText}>
            <Paragraph>{value ? value.email : null}</Paragraph>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => loadInBrowser(value.website)}>
          <Paragraph style={style.textinputHeading}>WEBSITE</Paragraph>
          <View style={styles.detailText}>
            <Paragraph>{value ? value.website : null}</Paragraph>
          </View>
        </TouchableOpacity>

        {/* <View style={{...styles.textContainer,alignItems:'center',justifyContent:'center',width:'100%',borderWidth:1}}> */}
        {/* <Paragraph style={style.textinputHeading}>TO DELETE A/c</Paragraph>
        <View style={styles.detailText1}>
          <RenderHtml contentWidth={width} source={source} />
        </View> */}
        <View>
          {loading ? (
            <View style={{...styles.loginButton, marginBottom: 20}}>
              <ActivityIndicator size="small" color={colours.White} />
            </View>
          ) : (
            <TouchableOpacity
              style={{...styles.loginButton, marginBottom: 20}}
              onPress={showAlert}>
              <Paragraph style={styles.loginText}>Delete Account</Paragraph>
            </TouchableOpacity>
          )}
        </View>
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  backImage: {
    width: 30,
    height: 30,
    margin: 20,
  },
  headerContainer: {
    marginTop: 10,
    marginLeft: '5%',
  },
  header: {
    fontSize: FontSize.LargeFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
  },
  enqText: {
    marginTop: 10,
    color: colours.SpanishGray,
  },
  textContainer: {
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%',
    paddingBottom: '2%',
    marginBottom: 10,
  },
  detailText: {
    height: 40,
    marginTop: '2%',
    width: '100%',
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
    justifyContent: 'center',
  },
  detailText1: {
    marginTop: '2%',
    width: '100%',
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
    justifyContent: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colours.SnowGrey,
    marginTop: '5%',
  },
  loginButton: {
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
  },
});
