import keyMirror from 'keymirror';

module.exports = {
  Action: keyMirror({
    GET_ALARM_DATA_SUCCESS: null,
    GET_ALARM_DATA_ERROR: null,
    SET_ALARM_DATA_SUCCESS: null,
    SET_ALARM_DATA_ERROR: null,
    GET_BASELINE_DATA_LOADING: null,
    GET_BASELINE_DATA_SUCCESS: null,
    GET_BASELINE_DATA_ERROR: null,
    SET_BASELINE_DATA_LOADING: null,
    SET_BASELINE_DATA_SUCCESS: null,
    SET_BASELINE_DATA_ERROR: null,
    SET_YEAR_IS_MODIFY: null,
    SET_MONTH_IS_MODIFY: null,
    SET_YEAR_DATA: null,
    SET_MONTH_DATA: null
  })
};
