import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    GET_ALL_INDUSTRIES_SUCCESS: null,
    GET_ALL_ZONES_SUCCESS: null,
    GET_BENCHMARK_DATA_SUCCESS: null,
    SET_SELECTED_BENCHMARK: null,
    CANCEL_SAVE_BENCHMARK: null,
    MODIFT_BENCHMARK_SUCCESS: null,
    MODIFT_BENCHMARK_ERROR: null,
    CREATE_BENCHMARK_SUCCESS: null,
    CREATE_BENCHMARK_ERROR: null,
    DELETE_BENCHMARK_SUCCESS: null,
    DELETE_BENCHMARK_ERROR: null
  })
};
