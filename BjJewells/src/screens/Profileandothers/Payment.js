import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {style, colours, FontSize, GET_COMPANY_URL, SALT} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import md5 from 'md5';
import {useSelector} from 'react-redux';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';

const Payment = () => {
  const navigation = useNavigation();

  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;

  const [value, setValue] = useState('');

  // changes...!
  const [gstin, setGstin] = useState("");
  const [bankName, setBankName] = useState("");
  const [acNo, setAcNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");

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
            // console.log('>>>>>details',response.data.parameters.payment_details);
            setValue(response.data.parameters);
            const data = response.data.parameters.payment_details;
            console.log('>>>>>>data', data)
            // const json = JSON.parse(response)
          } else {
            Toast.show(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log('About', error);
    }
  };

  return (
    <View style={style.mainContainer}>
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
        <Paragraph style={styles.header}>Payment Details</Paragraph>
      </View>
      <View style={styles.container}>
        <Paragraph selectable={true} style={style.textinputHeading}>
          GSTN : 33ADFFS2532R1ZQ
        </Paragraph>
        <Paragraph selectable={true} style={style.textinputHeading}>
          PAN NO : ADFFS2532R
        </Paragraph>
      </View>

      <View style={styles.headerContainer}>
        <Paragraph style={styles.header}>Banking Information</Paragraph>
      </View>
      <View style={styles.container} selectable>
        <Paragraph selectable={true} style={style.textinputHeading}>
          BANK NAME : IDBI Bank
        </Paragraph>
        <Paragraph selectable={true} style={style.textinputHeading}>
          AC.NO : 1621102000005487
        </Paragraph>
        <Paragraph selectable={true} style={style.textinputHeading}>
          IFSC CODE : IBKL0001621
        </Paragraph>
        <Paragraph selectable={true} style={style.textinputHeading}>
          BRANCH : Coimbatore Raja Street
        </Paragraph>
      </View>
    </View>
  );
};

export default Payment;

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
  textContainer: {
    marginTop: 20,
    width: '100%',
    padding: 20,
  },
  text: {
    fontSize: FontSize.MediumFontsize,
    color: colours.SpanishGray,
    fontFamily: 'Karla-Bold',
  },
  container: {
    width: '100%',
    padding: 20,
  },
});
