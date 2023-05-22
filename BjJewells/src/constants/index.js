import {StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';

export const colours = {
  ButtonBlueColor: '#3598D0',
  Black: '#000000',
  SpanishGray: '#989898',
  SnowGrey: '#E5E5E5',
  LightOrange: '#fff3db',
  LightGreen: '#bffff0',
  LightYellow: '#fff9bf',
  LightRose: '#fcd4f3',
  OrderAccepted: '#BD8800',
  WorkinProgress: '#1071B7',
  YettoStart: '#E014B3',
  White: '#FFFFFF',
  Red: '#FF0000',
  BorderGrey: '#F4F4F4',
  orderText: '#030229',
  tabinactive: '#D4D8E2',
  Orange: '#FF8C00',
  Green: '#006400',
  Delieverd: '#00A79D',
};
export const FontSize = {
  NormalFontsize: 14,
  MediumFontsize: 16,
  LargeFontsize: 18,
  HedingFontsize: 20,
};

export const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.White,
    paddingTop: Platform.OS === 'android' ? 0 : 35,
  },
  headingText: {
    fontSize: FontSize.HedingFontsize,
    color: colours.Black,
    fontFamily: 'Karla-Bold',
  },
  textinputHeading: {
    fontSize: FontSize.NormalFontsize,
    color: colours.SpanishGray,
    fontFamily: 'Karla-Bold',
    marginTop: 10,
  },
});

export const meltingpointdata = [
  '75',
  '76',
  '77',
  '78',
  '79',
  '80',
  '81',
  '82',
  '83',
  '84',
  '85',
  '86',
  '87',
  '88',
  '89',
  '90',
  '91',
  '92',
  '93',
  '94',
  '95',
];

export const baseUrl = 'https://sriibjjewels.in/admin/web/v1/';

export const SALT = 'bjjewels@TT)nS&XpNSs(*&^!@2022';

export const LOGIN_URL = baseUrl + 'user/login';
export const VERSION_URL = baseUrl + 'user/app-version';
export const DELETE_URL = baseUrl + 'user/user-delete-data';
export const REGISTER_URL = baseUrl + 'user/register';
export const FORGOT_PASSWORD_URL = baseUrl + 'user/forgot-password';
export const CHANGE_PASSWORD_URL = baseUrl + 'user/change-password';
export const GET_DASHBOARD_URL = baseUrl + 'user/get-dashboard-data';
export const GET_PROFILE_URL = baseUrl + 'user/get-profile-details';
export const GET_COMPANY_URL = baseUrl + 'user/company-details';
export const GET_ORDER_LIST_URL = baseUrl + 'order/order-list';
export const GET_NOTIFICATION_URL = baseUrl + 'user/notification-list';
export const GET_NOTIFI_INDICATOR_URL = baseUrl + 'user/notification-indicator';
export const GET_ORDER_DETAILS_URL = baseUrl + 'order/view-order-details';
export const GET_ITEM_TYPE = baseUrl + 'user/get-catalog-list';
export const GET_CATALOG_LIST = baseUrl + 'user/get-catalog-list';
export const CHANGE_ORDER_STATUS_URL = baseUrl + 'order/order-status-change';
export const CREATE_ORDER_URL = baseUrl + 'order/create-new-order-new';
export const USER_LOGOUT_URL = baseUrl + 'user/logout';
export const USER_DEVICE_REGISTER_URL =
  baseUrl + 'user/user-device-registration';
