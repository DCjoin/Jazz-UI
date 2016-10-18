import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_PROVIDER: null,
    SET_SELECT_PROVIDER: null,
    MERGE_PROVIDER: null,
    CANCEL_SAVE: null,
    MODIFY_SUCCESS: null,
    MODIFY_ERROR: null,
    CREATE_SUCCESS: null,
    DELETE_SUCCESS: null,
    SEND_EMAIL_SUCCESS: null,
    GET_CUSTOMER_IDENTITY: null,
    MERGE_CUSTOMER_IDENTITY: null,
    CANCEL_SAVE_CUSTOMER: null,
    MODIFY_CUSTOMER_SUCCESS: null,
    MODIFY_CUSTOMER_ERROR: null,
    CREATE_CUSTOMER_SUCCESS: null,
    DELETE_CUSTOMER_SUCCESS: null
  })

};
