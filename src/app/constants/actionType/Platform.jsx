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
    SEND_EMAIL_SUCCESS: null
  })

};