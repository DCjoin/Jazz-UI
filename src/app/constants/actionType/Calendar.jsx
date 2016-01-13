import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    GET_CALENDAR_LIST_SUCCESS: null,
    GET_CALENDAR_LIST_ERROR: null,
    SET_SELECTED_CALENDAR: null,
    CANCEL_SAVE_CALENDAR: null,
    MODIFT_CALENDAR_SUCCESS: null,
    DELETE_CALENDAR_SUCCESS: null,
    CREATE_CALENDAR_SUCCESS: null,
    CLEAR_ALL_CALENDAR_ERROR_TEXT: null,
    SET_CALENDAR_ERROR_TEXT: null
  })
};
