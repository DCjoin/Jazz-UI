import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_USER: null,
    PASSWORD_ERROR: null,
    GET_ROLE: null,
    RESET_USER_LIST: null,
    SET_BUBBLE_FLAG:null,
  }),
  bubbleType:keyMirror({
    ECM: null,
  })
};
