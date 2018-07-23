import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
  }),
  nodeType:{
    Organization: 0,
    Site: 1,
    Building: 2,
    Room: 3,
    Device: 5,
    GateWay:6,
    Tag:999
  }
};