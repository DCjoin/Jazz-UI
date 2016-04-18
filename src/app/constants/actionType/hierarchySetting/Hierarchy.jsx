import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_HIERARCHY_TREE_DTOS: null,
    SET_SELECTED_HIERARCHY_NODE: null,
    GET_CUSTOMER_FOR_HIERARCHY: null,
    GET_LOG_LIST_SUCCESS: null,
    GET_LOG_LIST_ERROR: null,
    DELETE_HIERARCHY_DTO_SUCCESS: null,
    HIERARCHY_ERROR: null,
    GET_ASSOCIATED_TAG: null,
    SAVE_ASSOCIATED_TAG_SUCCESS: null,
    CLEAR_ALL_ASSOCIATED_TAGS: null,
    GET_ALL_INDUSTRIES_FOR_HIERARCHY: null,
    GET_ALL_ZONES_FOR_HIERARCHY: null
  })

};
