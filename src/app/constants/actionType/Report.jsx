import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_REPORT_LIST_SUCCESS: null,
    GET_REPORT_LIST_ERROR: null,
    SET_SELECTED_REPORT_ITEM: null,
    GET_REPORT_TEMPLATE_LIST_SUCCESS: null,
    GET_REPORT_TEMPLATE_LIST_ERROR: null,
    SAVE_REPORT_SUCCESS: null,
    DELETE_REPORT_SUCCESS: null,
    DELETE_TEMPLATE_SUCCESS: null,
    SET_DEFAULT_REPORT_ITEM: null,
    GET_REPORT_TAG_DATA_SUCCESS: null,
    GET_SELECTED_REPORT_TAG_DATA_SUCCESS: null
  })

};
