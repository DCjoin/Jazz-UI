import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_VEE_RULES: null,
    SET_SELECTED_RULE_ID: null,
    GET_VEE_ALL_RECEIVERS: null,
    VEE_ERROR: null,
    DELETE_RULE_SUCCESS: null,
    GET_ASSOCIATED_TAG: null,
    SAVE_VEE_TAG_SUCCESS: null,
    CLEAR_ALL_VEE_TAGS: null
  })
};
