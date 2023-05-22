import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, Fragment, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as yup from 'yup';

import {
  style,
  FontSize,
  colours,
  CHANGE_PASSWORD_URL,
  SALT,
} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import md5 from 'md5';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';

const ChangePassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userid = route.params.data;
  // console.log('userid', userid);
  const [showpswd, setShowpswd] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState(true);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [match, setMatch] = useState(false);

  const formRef = useRef();

  const handleSubmit = () => {
    if (formRef.current) formRef.current.handleSubmit();
  };

  const onShowpswd = () => {
    [setShowpswd(showpswd => !showpswd)];
  };

  const onconfirm = () => {
    [setConfirmPassword(confirmPassword => !confirmPassword)];
  };

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .label('Password')
      .required('Please enter a valid Password'),
    confirmPassword: yup
      .string()
      .label('Confirm Password')
      .required('Please enter a Valid Password'),
  });

  const onSubmit = values => {
    // console.log('values', values);
    if (values.password === values.confirmPassword) {
      try {
        setLoading(true);
        const auth_token = md5(SALT + values.confirmPassword + userid.user_id);
        const endpoint = CHANGE_PASSWORD_URL;
        const data1 = {
          user_id: userid.user_id,
          new_password: values.confirmPassword,
          auth_token: auth_token,
        };
        const data = JSON.stringify(data1);
        // console.log('data', data);
        POST_API(endpoint, data)
          .then(res => {
            // console.log('res1', res.data);
            if (res.data.success) {
              setLoading(false);
              navigation.navigate('Success');
            } else {
              // console.log('res', res.data);
              setLoading(false);
            }
          })
          .catch(err => {
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (err) {
        setLoading(false);
        console.log('changepassword err', err);
      }
    } else {
      Alert.alert('Password does not match');
    }
  };

  return (
    <View style={style.mainContainer}>
      <View style={styles.headerContainer}>
        <Paragraph style={styles.header}>Change Password</Paragraph>
        <Paragraph style={styles.enqText}>Change your password here.</Paragraph>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{password: '', confirmPassword: ''}}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {formikProps => (
          <Fragment>
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
                  style={styles.input}
                  placeholder="Enter your Password"
                  placeholderTextColor={colours.SpanishGray}
                  secureTextEntry={showpswd}
                  onChangeText={formikProps.handleChange('password')}
                  onBlur={formikProps.handleBlur('password')}
                  value={formikProps.values.password}
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

            <View style={styles.textinputContainer}>
              <View style={styles.inputContainer}>
                <Paragraph style={style.textinputHeading}>
                  CONFIRM PASSWORD
                </Paragraph>
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
                  style={styles.input}
                  placeholder="Enter your Password"
                  placeholderTextColor={colours.SpanishGray}
                  secureTextEntry={confirmPassword}
                  onChangeText={formikProps.handleChange('confirmPassword')}
                  onBlur={formikProps.handleBlur('confirmPassword')}
                  value={formikProps.values.confirmPassword}
                />
              </View>
              {formikProps.touched.confirmPassword &&
              formikProps.errors.confirmPassword ? (
                <Text style={styles.errorText}>
                  {formikProps.errors.confirmPassword}
                </Text>
              ) : null}
              {confirmPassword ? (
                <TouchableOpacity
                  style={styles.invinsibleIcon}
                  onPress={onconfirm}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color={colours.DarkGray}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.invinsibleIcon}
                  onPress={onconfirm}>
                  <Image
                    source={require('../../Assets/Image/Invinsible.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Fragment>
        )}
      </Formik>

      <TouchableOpacity style={styles.chgpswdButton} onPress={handleSubmit}>
        <Paragraph style={styles.chgpswdText}>Change Password</Paragraph>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  backImage: {
    width: 30,
    height: 30,
    margin: 20,
  },
  headerContainer: {
    marginTop: '5%',
    marginLeft: '5%',
  },
  header: {
    fontSize: FontSize.LargeFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
    marginTop: 30,
  },
  enqText: {
    marginTop: 10,
    color: colours.SpanishGray,
  },
  textinputContainer: {
    marginTop: 30,
    marginLeft: '5%',
    marginRight: '5%',

    paddingBottom: '2%',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  mobileText: {
    fontSize: FontSize.NormalFontsize,
    color: colours.SpanishGray,
  },
  mustSymbol: {
    marginTop: '3%',
    color: colours.Red,
  },
  input: {
    marginTop: '2%',
    width: '80%',
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
  },
  invinsibleIcon: {
    position: 'absolute',
    right: '5%',
    top: 50,
    width: 20,
    height: 20,
  },
  addressInput: {
    marginTop: '2%',
    width: '100%',
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
    height: 150,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  errorText: {
    color: colours.Red,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: '2%',
    marginLeft: '5%',
    marginRight: '5%',
  },
  valueText: {
    marginTop: 8,
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
  },
  roleConatiner: {
    marginTop: '5%',
    marginLeft: '5%',
    flexDirection: 'row',
  },
  checkContainer: {
    flexDirection: 'row',
    marginLeft: '5%',
    marginRight: '5%',
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  chgpswdButton: {
    position: 'absolute',
    bottom: '0%',
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
  },
  chgpswdText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
  },
  accConatiner: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    alignItems: 'center',
  },
  alreadyaccText: {
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
  },
});
