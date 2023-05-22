import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  user_id: '',
  filter: '',
  image: '',
  fcmToken: '',
  catalog_image: '',
  screen_name: '',
  new_order_image: ['']
};

const userSlicer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUser: (state, action) => ({...state, user_id: action.payload}),
    setFilter: (state, action) => ({...state, filter: action.payload}),
    setImage: (state, action) => ({...state, image: action.payload}),
    setFcmToken: (state, action) => ({...state, fcmToken: action.payload}),
    setNewOrderImage: (state, action) => ({...state, new_order_image: action.payload}),
    setCatalogImage: (state, action) => ({
      ...state,
      catalog_image: action.payload,
    }),
    setScreenName: (state, action) => ({
      ...state,
      screen_name: action.payload,
    }),
    
  },
});
export default userSlicer.reducer;

export const {
  setUser,
  setFilter,
  setImage,
  setFcmToken,
  setCatalogImage,
  setScreenName,
  setNewOrderImage,
} = userSlicer.actions;
