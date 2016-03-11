import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    GET_LABEL_LIST_SUCCESS: null,
    GET_LABEL_LIST_ERROR: null,
    SET_SELECTED_LABEL: null,
    CANCEL_SAVE_LABEL: null,
    MODIFT_LABEL_SUCCESS: null,
    MODIFT_LABEL_ERROR: null,
    CREATE_LABEL_SUCCESS: null,
    CREATE_LABEL_ERROR: null,
    DELETE_LABEL_SUCCESS: null,
    DELETE_LABEL_ERROR: null
  })
};
