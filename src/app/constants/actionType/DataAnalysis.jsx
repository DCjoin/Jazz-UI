import keyMirror from 'keymirror';

module.exports = {

    Action:keyMirror({
      GET_WIDGET_GATHER_INFO:null,
      SET_INITIAL_WIDGET_DTO:null,
      GET_MANUAL_TAGS:null,
      GET_LATEST_RAW_DATA:null,
      SAVE_RAW_DATA_SUCCESS:null,
      JUDGET_IF_LEAVE:null,
      SELECTED_TAG_CHANGE:null,
      GET_WEATHER_TAG:null,
      CLEAR_WEATHER_TAG:null,
      CLEAR_SELECTED_TAG:null,
      CHECKED_TAG:null,
      GET_SPLIT_GATHER_INFO:null,
      MODIFY_SPLIT:null,
      REFRESH_SPLITS:null,
      CLEAR_INTERVAL_INFO:null
  }),
  status:{
    ADD:1,
    MODIFY:2,
    DELETE:3,
  },

};
