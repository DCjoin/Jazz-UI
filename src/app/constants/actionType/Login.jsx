import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    //SP_LOGIN_SUCCESS: null,
    LOGIN_SUCCESS: null,
    LOGIN_ERROR: null,
    LOGOUT: null,
    FEDLOGIN_GO: null,
    //MOBILE_LOGIN_SUCCESS: null,
    //MOBILE_LOGIN_ERROR: null,
    GET_AUTH_CODE_SUCCESS: null,
    GET_AUTH_CODE_ERROR: null,
    RESET_AUTH_CODE_STATUE: null,
    REQ_PSWRESET_SUCCESS:null,
    REQ_PSWRESET_ERROR:null,
    REQ_DEMO_APPLY_SUCCESS:null,
    REQ_DEMO_APPLY_ERROR:null,
  })

};
