import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_TOU_TARIFFS: null,
    SET_SELECTED_TARTIFF_ID: null,
    RESET_TARIFF: null,
    MERGE_TARIFF: null,
    ADD_PEAK_TIMERANGE: null,
    ADD_VALLEY_TIMERANGE: null,
    DELETE_PEAK_TIMERANGE: null,
    DELETE_VALLEY_TIMERANGE: null,
    SAVE_TARIFF_SUCCESS: null,
    TARIFF_ERROR: null,
    ADD_PULSE_PEAK_DATE: null,
    DELETE_PULSE_PEAK_TIMERANGE: null,
    DELETE_TARIFF_SUCCESS: null
  })
};
