import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ToastAndroid,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Alert,
  Keyboard,
  StatusBar,
  Linking
} from 'react-native';
import React, {useState, Fragment, useRef, useEffect} from 'react';

import {style, FontSize, colours, SALT, LOGIN_URL,VERSION_URL} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {Formik} from 'formik';
import * as yup from 'yup';
import DeviceInfo from 'react-native-device-info';
import {POST_API} from '../../api/POST';
import md5 from 'md5';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUser} from '../../redux/Slice/user';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showpswd, setShowpswd] = useState(true);
  const [loading, setLoading] = useState(false);
  

  const formRef = useRef();

  const handleSubmit = () => {
    if (formRef.current) formRef.current.handleSubmit();
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@user_id', jsonValue);
      console.log('store data', value);
      dispatch(setUser(value));
    } catch (e) {
      console.log('async login ', e);
    }
  };

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .label('Password')
      .required('Please enter a registered Password'),
    mobile: yup
      .string()
      .max(10, 'Please enter a valid mobile number')
      .min(10, 'Please enter a valid mobile number')
      .matches(/^[6789]\d{9}$/gm, 'Please enter a valid mobile number')
      .required('Please enter your mobile number'),
  });

  const onShowpswd = () => {
    [setShowpswd(showpswd => !showpswd)];
  };

  const device_token = DeviceInfo.getUniqueId();
 

  const onSubmit = values => {
    // console.log('values', values);
    try {
      setLoading(true);
      const auth_token = md5(SALT + values.mobile + values.password);
      const endpoint = LOGIN_URL;
      const data = {
        mobile: values.mobile,
        password: values.password,
        unique_device_id: device_token,
        auth_token: auth_token,
      };
      // console.log('login data', data);
      POST_API(endpoint, data)
        .then(res => {
          if (res.data.success) {
            storeData(res.data);

            Toast.show('Login Successfully');
          } else {
            console.log('login err', res.data);
            setLoading(false);
            Alert.alert(
              'Login Failed',
              res.data.message,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.navigate('Login');
                  },
                },
              ],
              {cancelable: false},
            );
          }
        })
        .catch(err => {
          setLoading(false);

          Toast.show(err);
        });
    } catch (err) {
      console.log('Login err', err);
    }
  };

  return (
    <View style={{...style.mainContainer}}>
      <Image
        source={require('../../Assets/Image/LoginBanner.png')}
        style={styles.bannerImage}
      />
      <KeyboardAwareScrollView
        style={{flexGrow: 1, backgroundColor: colours.White}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Paragraph style={styles.header}>Login</Paragraph>
          <Paragraph style={styles.signinText}>
            Sign in to your Account
          </Paragraph>
        </View>
        <Formik
          innerRef={formRef}
          initialValues={{password: '', mobile: ''}}
          onSubmit={onSubmit}
          validationSchema={validationSchema}>
          {formikProps => (
            <Fragment>
              <View style={styles.textinputContainer}>
                <View style={styles.inputContainer}>
                  <Paragraph style={style.textinputHeading}>
                    MOBILE NUMBER
                  </Paragraph>
                  <Paragraph style={styles.mustSymbol}> *</Paragraph>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mobile number"
                  placeholderTextColor={colours.SpanishGray}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={formikProps.handleChange('mobile')}
                  onBlur={formikProps.handleBlur('mobile')}
                  value={formikProps.values.mobile}
                />
                {formikProps.touched.mobile && formikProps.errors.mobile ? (
                  <Text style={styles.errorText}>
                    {formikProps.errors.mobile}
                  </Text>
                ) : null}
              </View>
              <View style={styles.textinputContainer}>
                <View style={styles.inputContainer}>
                  <Paragraph style={style.textinputHeading}>PASSWORD</Paragraph>
                  <Paragraph style={styles.mustSymbol}> *</Paragraph>
                </View>
                <View
                  style={{
                    marginTop: '2%',
                    width: '100%',
                    height: 50,
                    backgroundColor: colours.SnowGrey,
                    borderRadius: 5,
                    paddingLeft: 10,
                    color: colours.Black,
                  }}>
                  <TextInput
                    style={{
                      width: '80%',
                      height: 50,

                      color: colours.Black,
                    }}
                    placeholder="Enter your Password"
                    placeholderTextColor={colours.SpanishGray}
                    secureTextEntry={showpswd}
                    onChangeText={formikProps.handleChange('password')}
                    onBlur={formikProps.handleBlur('password')}
                    value={formikProps.values.password}
                    onSubmitEditing={handleSubmit}
                  />
                </View>
                {formikProps.touched.password && formikProps.errors.password ? (
                  <Text style={styles.errorText}>
                    {formikProps.errors.password}
                  </Text>
                ) : null}
                {showpswd ? (
                  <TouchableOpacity
                    style={styles.invinsibleIcon}
                    onPress={onShowpswd}>
                    <Ionicons
                      name="eye-outline"
                      size={20}
                      color={colours.DarkGray}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.invinsibleIcon}
                    onPress={onShowpswd}>
                    <Image
                      source={require('../../Assets/Image/Invinsible.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Fragment>
          )}
        </Formik>
        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}>
          <Paragraph>Forgot Password ?</Paragraph>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => {
              navigation.navigate('Enquire');
            }}>
            <Paragraph style={styles.signupText}>
              I don’t have an account
            </Paragraph>
          </TouchableOpacity>
        </View>
        <View>
          {loading ? (
            <View style={styles.loginButton}>
              <ActivityIndicator size="small" color={colours.White} />
            </View>
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <Paragraph style={styles.loginText}>Login</Paragraph>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: '40%',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  headerContainer: {
    marginTop: '5%',
    marginLeft: '5%',
  },
  header: {
    fontSize: FontSize.LargeFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
  },
  signinText: {
    marginTop: 10,
    color: colours.SpanishGray,
  },
  textinputContainer: {
    marginTop: 0,
    marginLeft: '5%',
    marginRight: '5%',
    paddingBottom: '2%',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  mustSymbol: {
    marginTop: '3%',
    color: colours.Red,
  },
  input: {
    marginTop: '2%',
    width: '100%',
    height: 50,
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
  },
  invinsibleIcon: {
    position: 'absolute',
    right: '5%',
    top: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  forgotContainer: {
    marginTop: 10,
    marginLeft: '5%',
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
  signupText: {
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Bold',
  },
  signupContainer: {
    marginTop: 20,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colours.Red,
  },
});
