import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_CUSTOMERS: null,
    SET_SELECTED_COSTOMER_ID: null,
    MERGE_CUSTOMER: null,
    GET_ENERGY_INFO: null,
    MERGE_CUSTOMER_ENERGYINFO: null,
    RESET_CUSTOMER: null,
    SAVE_CUATOMER_SUCCESS: null,
    SAVE_CUATOMER_ENERGYINFO_SUCCESS: null,
    CUSTOMER_ERROR: null
  })
};
