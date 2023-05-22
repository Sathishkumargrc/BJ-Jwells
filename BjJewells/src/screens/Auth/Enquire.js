import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, Fragment, useRef} from 'react';

import {Formik} from 'formik';
import * as yup from 'yup';
import {RadioButton} from 'react-native-paper';
import md5 from 'md5';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {style, FontSize, colours, SALT, REGISTER_URL} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';

const Enquire = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [value, setValue] = useState('2');
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  const handleSubmit = () => {
    if (formRef.current) formRef.current.handleSubmit();
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .label('Name')
      .required('Please enter your name')
      .matches(/^[a-zA-Z\s]*$/, 'Please enter valid name')
      .trim(),
    mobile: yup
      .string()
      .matches(/^[6789]\d{9}$/gm, 'Please enter a valid mobile number')
      .required('Please enter your mobile number'),
    address: yup.string().required('Please enter your address'),
  });

  const onSubmit = values => {
    if (
      value === '' &&
      values.name === '' &&
      values.mobile === '' &&
      values.address === ''
    ) {
      Alert.alert(
        'Error',
        'Please enter your details',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Enquire'),
          },
        ],
        {cancelable: false},
      );
    } else {
      try {
        setLoading(true);
        const auth_token = md5(SALT + values.mobile + values.name);
        const endpoint = REGISTER_URL;
        const data = {
          name: values.name,
          mobile: values.mobile,
          role: value,
          address: values.address,
          auth_token: auth_token,
        };
        POST_API(endpoint, data)
          .then(res => {
            if (res.data.success) {
              // console.log('res', res.data);
              Alert.alert(
                'Success',
                res.data.message,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      Toast.show(
                        'Kindly wait for the admin to approve your request',
                      );

                      navigation.navigate('Login');
                    },
                  },
                ],
                {cancelable: false},
              );
            } else {
              Alert.alert(
                'Error',
                res.data.message,
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Enquire'),
                  },
                ],
                {cancelable: false},
              );
              // console.log(res.data);
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
        console.log('Enquuire err', err);
      }
    }
  };

  return (
    <ScrollView
      style={style.mainContainer}
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
        <Paragraph style={styles.header}>Enquire Now</Paragraph>
        <Paragraph style={styles.enqText}>
          Enquire here to join in Account
        </Paragraph>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{name: '', mobile: '', address: ''}}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
        {formikProps => (
          <Fragment>
            <View style={styles.textinputContainer}>
              <View style={styles.inputContainer}>
                <Paragraph style={style.textinputHeading}>NAME</Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colours.SpanishGray}
                keyboardType="default"
                onChangeText={formikProps.handleChange('name')}
                onBlur={formikProps.handleBlur('name')}
                value={formikProps.values.name}
              />
              {formikProps.touched.name && formikProps.errors.name ? (
                <Text style={styles.errorText}>{formikProps.errors.name}</Text>
              ) : null}
            </View>
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
            <View style={styles.roleConatiner}>
              <Paragraph style={style.textinputHeading}>
                WORK STATION OR JEWELLERY STORE
              </Paragraph>
              <Paragraph style={styles.mustSymbol}> *</Paragraph>
            </View>
            <RadioButton.Group
              onValueChange={value => setValue(value)}
              value={value}>
              <View style={styles.checkContainer}>
                <View style={styles.checkboxContainer}>
                  <RadioButton
                    value="3"
                    color={colours.ButtonBlueColor}
                    uncheckedColor={colours.SpanishGray}
                  />
                  <Text style={styles.valueText}>Work Station</Text>
                </View>
                <View style={styles.checkboxContainer}>
                  <RadioButton
                    value="2"
                    color={colours.ButtonBlueColor}
                    uncheckedColor={colours.SpanishGray}
                  />
                  <Text style={styles.valueText}>Jewellery Store</Text>
                </View>
              </View>
            </RadioButton.Group>
            <View style={styles.textinputContainer}>
              <View style={styles.inputContainer}>
                <Paragraph style={style.textinputHeading}>ADDRESS</Paragraph>
                <Paragraph style={styles.mustSymbol}> *</Paragraph>
              </View>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your address"
                placeholderTextColor={colours.SpanishGray}
                keyboardType="default"
                onChangeText={formikProps.handleChange('address')}
                onBlur={formikProps.handleBlur('address')}
                value={formikProps.values.address}
                numberOfLines={5}
                multiline={true}
                onSubmitEditing={handleSubmit}
              />
              {formikProps.touched.address && formikProps.errors.address ? (
                <Text style={styles.errorText}>
                  {formikProps.errors.address}
                </Text>
              ) : null}
            </View>
          </Fragment>
        )}
      </Formik>

      <TouchableOpacity
        style={styles.accConatiner}
        onPress={() => {
          navigation.navigate('Login');
        }}>
        <Paragraph style={styles.alreadyaccText}>
          Already have an account
        </Paragraph>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.enquireButton}>
          <ActivityIndicator size="small" color={colours.White} />
        </View>
      ) : (
        <TouchableOpacity style={styles.enquireButton} onPress={handleSubmit}>
          <Paragraph style={styles.enquireText}>Enquire Now</Paragraph>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default Enquire;

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
    width: '100%',
    height: 50,
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
  },
  addressInput: {
    padding: 10,
    marginTop: '2%',
    width: '100%',
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
    height: 150,
    marginBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  enquireButton: {
    marginTop: 25,
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enquireText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
  },
  accConatiner: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  alreadyaccText: {
    fontSize: FontSize.NormalFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Medium',
  },
});
