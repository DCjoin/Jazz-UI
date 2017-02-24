import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_ENERGY_SOLUTION_SUCCESS:null,
    CHECK_SOLUTION:null,
    PUSH_PROBLEM_SUCCESS:null,
    RESET_SNACKBAR_TEXT:null,
    MERGE_MEASURE:null
  }),
  ThumbnailSize:'160w_80h',
  DetailSize:'600w_300h',
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
