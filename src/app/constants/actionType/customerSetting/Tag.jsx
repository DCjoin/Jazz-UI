import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    GET_TAG_LIST_SUCCESS: null,
    GET_TAG_LIST_ERROR: null,
    SET_SELECTED_TAG: null,
    CANCEL_SAVE_TAG: null,
    MODIFT_TAG_SUCCESS: null,
    MODIFT_TAG_ERROR: null,
    CREATE_TAG_SUCCESS: null,
    CREATE_TAG_ERROR: null,
    DELETE_TAG_SUCCESS: null,
    DELETE_TAG_ERROR: null,
    GET_ALL_TAG_LIST_SUCCESS: null,
    GET_ALL_TAG_LIST_ERROR: null,
    GET_LOG_LIST_SUCCESS: null,
    GET_LOG_LIST_ERROR: null,
    GET_TAG_DATAS_SUCCESS: null,
    SET_FILTER_OBJ: null,
    SET_FORMULA_FILTER_OBJ: null,
    SET_POINT_TO_LIST: null,
  })
};
