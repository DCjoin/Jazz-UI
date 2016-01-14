import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_CONVERSION_PAIRS: null,
    GET_ALL_CARBON_FACTOR: null,
    SET_SELECTED_ID: null,
    MERGE_CARBON: null,
    ADD_FACTOR: null,
    DELETE_FACTOR: null,
    SAVE_FACTOR_SUCCESS: null,
    DELETE_FACTOR_SUCCESS: null,
  })
};
