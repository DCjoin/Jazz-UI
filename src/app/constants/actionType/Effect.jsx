import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    UPDATE_TAGS: null,
    GET_ENERGY_EFFECT:null,
  }),
  calcState:{
    NotStarted:10,
    Being:20,
    Done:30
  }

};
