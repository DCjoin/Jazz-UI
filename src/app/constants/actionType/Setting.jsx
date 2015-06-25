import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    LOAD_SETTING_DATA: null,
    SAVE_SETTING_SUCCESS: null,
    SAVE_SETTING_ERROR: null,
    GET_MODIFY_DATA: null,
    SET_MODIFY_DATA_SUCCESS: null,
    SET_MODIFY_DATA_ERROR: null
  })
};
