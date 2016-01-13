import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    SET_USER_STATUS: null,
    LOAD_USER_LIST: null,
    SET_ALL_USERS_STATUS: null,
    RESET_USER_LIST: null,
    GET_ALL_COSTOMERS_LIST: null,
    GET_ALL_ROLES_LIST: null,
    GET_ALL_USERS_LIST: null,
    RESET_FILTER: null,
    MERGE_FILTER_OBJ: null,
    SET_FILTER_OBJ: null,
    RESET_FILTER_OBJ: null,
    SET_CURRENT_SELECTED_ID: null,
    MERGE_USER_CUSTOMER: null,
    GET_CUSTOMER_BY_USER: null,
    GET_CUSTOMER_PERMISSION_BY_USER: null,
    MERGE_USER: null,
    MODIFY_USER_SUCCESS: null,
    UPDATE_CUSTOMER_INFO: null,
    SEND_EMAIL_SUCCESS: null,
    DELETE_USER_SUCCESS: null,
    RESET_USER_AND_CUSTOMER: null,
    USER_ERROR: null
  })
};
