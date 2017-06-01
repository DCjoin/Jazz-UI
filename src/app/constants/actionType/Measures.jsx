import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_ENERGY_SOLUTION_SUCCESS:null,
    CHECK_SOLUTION:null,
    PUSH_PROBLEM_SUCCESS:null,
    RESET_SNACKBAR_TEXT:null,
    MERGE_MEASURE:null,
    GET_SUPERVISOR_SUCCESS:null,
    ASSIGN_SUPERVISOR_SUCCESS:null,
    GET_ACTIVE_COUNTS:null,
    GET_CONTAINS_UNREAD:null,
    GET_REMARK_LIST_SUCCESS:null,
    ADD_REMARK:null,
    DELETE_REMARK:null,
    SET_SNACKBAR_TEXT:null,
    DELETE_SUPERVISOR_SUCCESS:null,
    DELETE_SUPERVISOR_ERROR:null,

  }),
  Msg: keyMirror({
    DELETE_SUPERVISOR_ERROR:null,
    DELETE_SUPERVISOR_SUCCESS:null,
  }),
  ThumbnailSize:'w_146,h_97',
  DetailSize:'w_600,h_400',
  Status:{
    NotPush:1,
    ToBe:2,
    Being:3,
    Done:4,
    Canceled:0
  },
  DIALOG_TYPE:keyMirror({
    PUSH:null,
    BATCH_PUSH:null,
    DELETE:null,
    MEASURE:null
  })


};
