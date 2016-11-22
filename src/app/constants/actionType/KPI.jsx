import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_QUOTAPERIOD:null,
    GET_KPI_DIMENSION_SUCCESS:null,
    GET_KPI_TAGS_SUCCESS:null,
    GET_KPI_INFO_SUCCESS:null,
    MERGE_KPI_INFO:null,
  }),

  Type:{
    Quota:1,
    SavingRate:2
  }

};
