import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, Fragment, useRef} from 'react';
import Toast from 'react-native-simple-toast';
import {Formik} from 'formik';
import * as yup from 'yup';

import {
  style,
  FontSize,
  colours,
  FORGOT_PASSWORD_URL,
  SALT,
} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import md5 from 'md5';
import {useNavigation} from '@react-navigation/native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const ForgotPassword = () => {
  const navigation = useNavigation();

  const [value, setValue] = React.useState('');
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  const handleSubmit = () => {
    if (formRef.current) formRef.current.handleSubmit();
  };

  const validationSchema = yup.object().shape({
    mobile: yup
      .string()
      .matches(/^[6789]\d{9}$/gm, 'Please enter a valid mobile number')
      .required('Please enter your mobile number'),
  });

  const onSubmit = values => {
    try {
      setLoading(true);
      const auth_token = md5(SALT + values.mobile);
      const endpoint = FORGOT_PASSWORD_URL;
      const data = {
        mobile: values.mobile,
        auth_token: auth_token,
      };
      POST_API(endpoint, data)
        .then(res => {
          if (res.data.success) {
            setLoading(false);
            // console.log('res', res.data);
            Toast.show(res.data.message);

            navigation.navigate('ChangePassword', {data: res.data.parameters});
          } else {
            setLoading(false);
            Toast.show(res.data.message);
          }
        })
        .catch(err => {
          setLoading(false);
          Toast.show(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      console.log('ForgotPassword err', err);
    }
  };

  return (
    <ScrollView style={style.mainContainer}>
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
        <Paragraph style={styles.header}>Forgot Password</Paragraph>
        <Paragraph style={styles.enqText}>
          Enter your Mobile Number to reset Password
        </Paragraph>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{mobile: ''}}
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
                keyboardType="numeric"
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
          </Fragment>
        )}
      </Formik>
      <View>
        {loading ? (
          <View style={styles.forpswdButton}>
            <ActivityIndicator size="small" color={colours.White} />
          </View>
        ) : (
          <TouchableOpacity style={styles.forpswdButton} onPress={handleSubmit}>
            <Paragraph style={styles.forpswdText}>Change Password</Paragraph>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

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
    height: screenHeight * 0.06,
  },
  mobileText: {
    fontSize: FontSize.NormalFontsize,
    color: colours.SpanishGray,
  },
  mustSymbol: {
    marginTop: 12,
    color: colours.Red,
  },
  input: {
    marginTop: '2%',
    width: '100%',
    height: 40,
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
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
  forpswdButton: {
    marginTop: screenHeight * 0.5,
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
  },
  forpswdText: {
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
