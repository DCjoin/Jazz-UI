import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    HIERNODE_CHANGED: null,
    GET_ALL_INDUSTRIES_SUCCESS: null,
    GET_ALL_INDUSTRIES_ERROR: null,
    GET_ALL_ZONES_SUCCESS: null,
    GET_ALL_ZONES_ERROR: null,
    GET_ALL_LABELS_SUCCESS: null,
    GET_ALL_LABELS_ERROR: null,
    GET_ALL_CUSTOMER_LABELS_SUCCESS: null,
    GET_ALL_CUSTOMER_LABELS_ERROR: null,
    GET_BENCHMARK_DATA_SUCCESS: null,
    GET_BENCHMARK_DATA_ERROR: null,
    GET_HIERNODES_BY_ID_SUCCESS: null,
    GET_HIERNODES_BY_ID_ERROR: null,
    SET_SELECTED_LABELING: null,
    CANCEL_SAVE_LABELING: null,
    MODIFT_LABELING_SUCCESS: null,
    MODIFT_LABELING_ERROR: null,
    CREATE_LABELING_SUCCESS: null,
    CREATE_LABELING_ERROR: null,
    DELETE_LABELING_SUCCESS: null,
    DELETE_LABELING_ERROR: null
  })
};
