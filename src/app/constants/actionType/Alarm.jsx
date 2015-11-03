import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GLOBAL_ERROR_MESSAGE_CHANGED: null,
    CLEAR_GLOBAL_ERROR_MESSAGE: null,
    DATETYPE_CHANGED: null,
    DATALIST_CHANGED: null,
    GET_HIERARCHY_LIST_ERROR: null,
    GET_ALARM_TAG_DATA_LOADING: null,
    GET_TAG_DATA_LOADING: null,
    GET_TAG_DATA_SUCCESS: null,
    GET_TAG_DATA_ERROR: null,
    GET_DASHBOARD_BY_HIERARCHY_SUCCESS: null,
    GET_DASHBOARD_BY_HIERARCHY_ERROR: null,
    SAVE_TO_DASHBOARD_SUCESS: null,
    SAVE_TO_DASHBOARD_ERROR: null,
    SET_OPTION: null,
    SET_SELECTED_ALARM_TAG: null,
  })

};
