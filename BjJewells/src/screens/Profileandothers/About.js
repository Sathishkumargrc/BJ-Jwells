import {StyleSheet, TouchableOpacity, View, Image, sta} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import md5 from 'md5';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {useIsFocused} from '@react-navigation/native';
import {style, colours, FontSize, GET_COMPANY_URL, SALT} from '../../constants';
import Paragraph from '../../components/Paragraph';
import {POST_API} from '../../api/POST';
import Toast from 'react-native-simple-toast';

const About = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const userid = useSelector(state => state.user.user_id);
  const user_id = userid.parameters.user_data.user_id;

  const [value, setValue] = useState('');

  useEffect(() => {
    apicall();
    navigation.closeDrawer();
  }, [focused]);

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
            // console.log(response.data.parameters);
            setValue(response.data.parameters);
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
  const {width} = useWindowDimensions();
  const source = {
    html: `${value.about_us}`,
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
        <Paragraph style={styles.header}>About Us</Paragraph>
      </View>
      <View style={styles.textContainer}>
        <RenderHtml contentWidth={width} source={source} />
      </View>
    </View>
  );
};

export default About;

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
});
