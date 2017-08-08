import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    GET_ENERGY_EFFECT:null,
    GET_EFFECT_RATE_TAG:null,
    SAVE_EFFECT_RATE_TAG:null
  }),
  calcState:{
    NotStarted:10,
    Being:20,
    Done:30
  }

};
