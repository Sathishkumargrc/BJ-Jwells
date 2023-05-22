import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {style, FontSize, colours, meltingpointdata} from '../../constants';
import Paragraph from '../../components/Paragraph';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {YearMonthDateField} from 'react-native-datefield';
import moment from 'moment';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setFilter} from '../../redux/Slice/user';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
// import ScrollPicker from 'react-native-picker-scrollview';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Filter = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const datas = useRoute().params.data;
  const [model, setModel] = useState('');
  const [date, setDate] = useState('');
  const [melting, setMelting] = useState('');
  const [seal, setSeal] = useState('');
  const [refNumber,setRefNumber] = useState('');
  const [index, setIndex] = useState(0);
  const role = useSelector(
    state => state.user.user_id.parameters.user_data.role,
  );

  console.log('role is', role);

  const data = {
    model_name: model,
    date: date ? moment(date).format('YYYY-MM-DD') : '',
    melting_point: melting,
    seal: seal,
    ref_no:refNumber
  };

  const clearFilter = () => {
    setModel('');
    setDate('');
    setMelting('');
    setSeal('');
    setRefNumber('');
    setIndex(0);
  };

  return (
    <ScrollView
      style={style.mainContainer}
      showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => {
          navigation.navigate(datas);
        }}>
        <Image source={require('../../Assets/Image/Back.png')} />
      </TouchableOpacity>
      <View style={styles.headingContainer}>
        <Paragraph style={styles.headingText}>Filter</Paragraph>
      </View>

      <TouchableOpacity
        style={styles.clearfilterConatiner}
        onPress={() => {
          clearFilter();
          dispatch(setFilter(''));
        }}>
        <Paragraph>Clear Filter</Paragraph>
      </TouchableOpacity>

      <View style={{alignItems: 'center'}}>
        <View style={styles.titleConatiner}>
          <Paragraph style={styles.textinputHeading}>MODEL NAME</Paragraph>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={styles.textInput}
            placeholder="Model Name"
            placeholderTextColor={colours.grey}
            onChangeText={text => {
              setModel(text);
            }}
            value={model}
          />
          <Ionicons
            name="ios-search"
            size={25}
            color={colours.grey}
            style={styles.searchIcon}
          />
        </View>
        <View style={styles.titleConatiner}>
          <Paragraph style={styles.textinputHeading}>DATE</Paragraph>
        </View>
        <View>
          <YearMonthDateField
            styleInput={styles.inputBorder}
            onSubmit={value => setDate(value)}
            value={date}
          />
        </View>
        <View style={styles.titleConatiner}>
          <Paragraph style={styles.textinputHeading}>MELTING POINT*</Paragraph>
        </View>

        {/* <ScrollPicker
          dataSource={meltingpointdata}
          selectedIndex={index}
          value={melting}
          renderItem={(data, index) => {
            return (
              <View style={styles.pickcontainer}>
                <Paragraph style={styles.pickerText}>{data}</Paragraph>
              </View>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            console.log('render', data, selectedIndex);
            setMelting(data);
          }}
          wrapperHeight={100}
          wrapperWidth={150}
          wrapperColor="#fff"
          itemHeight={50}
          highlightColor="#000000"
          highlightBorderWidth={2}
        /> */}
            <View >
              <TextInput style={{...styles.textInput}}
          placeholder="Enter Melting Point"
          placeholderTextColor={colours.Grey}
                    name="meltingPoint"
                    onChangeText={(value)=>setMelting(value)}
                    value={melting}
                    keyboardType="numeric"></TextInput>
              </View>

        {/* {role =='CUSTOMER' ? (
          <View>
            <View style={styles.titleConatiner}>
              <Paragraph style={styles.textinputHeading}>SEAL</Paragraph>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Seal"
                placeholderTextColor={colours.grey}
                onChangeText={text => {
                  setSeal(text);
                }}
                value={seal}
              />
              <Ionicons
                name="ios-search"
                size={25}
                color={colours.grey}
                style={styles.searchIcon}
              />
            </View>
          </View>
        ) : ( */}
          <View>
            <View style={styles.titleConatiner}>
              <Paragraph style={styles.textinputHeading}>ORDER NO</Paragraph>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Order no"
                placeholderTextColor={colours.grey}
                onChangeText={text => {
                  setRefNumber(text);
                }}
                value={refNumber}
              />
              <Ionicons
                name="ios-search"
                size={25}
                color={colours.grey}
                style={styles.searchIcon}
              />
            </View>
          </View>
        {/* )} */}
      </View>
      <View style={{marginTop: 120}} />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          console.log('datas', datas);
          console.log('data', data);
          dispatch(setFilter(data));
          navigation.navigate(datas);
        }}>
        <Paragraph style={styles.filterText}>Apply Filter</Paragraph>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Filter;

const styles = StyleSheet.create({
  backIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContainer: {
    marginLeft: 20,
    width: '50%',
    height: 30,
  },
  headingText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.Black,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: '2%',
    width: screenWidth * 0.87,
    height: 50,
    backgroundColor: colours.SnowGrey,
    borderRadius: 5,
    paddingLeft: 10,
    color: colours.Black,
  },
  searchIcon: {
    position: 'absolute',
    top: 18,
    right: 10,
  },
  titleConatiner: {
    marginTop: 20,
    width: screenWidth * 0.87,
  },
  textinputHeading: {
    fontSize: FontSize.NormalFontsize,
    color: colours.SpanishGray,
    fontFamily: 'Karla-Bold',
    marginTop: 10,
  },
  inputBorder: {
    width: '30%',
    borderRadius: 8,
    backgroundColor: colours.SnowGrey,
    height: 50,
    marginBottom: 20,
    marginTop: 10,
  },
  filterButton: {
    width: '100%',
    height: 60,
    backgroundColor: colours.ButtonBlueColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterText: {
    fontSize: FontSize.LargeFontsize,
    color: colours.White,
    fontFamily: 'Karla-Bold',
  },
  clearfilterConatiner: {
    width: 75,
    height: 20,

    position: 'absolute',
    top: 55,
    right: '10%',
  },
  pickcontainer: {
    width: screenWidth * 0.3,
    alignItems: 'center',
    height: 20,
  },
});
