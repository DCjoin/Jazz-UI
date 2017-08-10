import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    UPDATE_TAGS: null,
    GET_ENERGY_EFFECT:null,
    GET_PREVIEW_CHART2:null,
    GET_PREVIEW_CHART3:null,
  }),
  calcState:{
    NotStarted:10,
    Being:20,
    Done:30
  },

  Model: {
  	Manual: 1,
  	Contrast: 2,
  	Easy: 3,
  	Increment: 4,
  	Relation: 5,
  	Efficiency: 6,
  	Simulation: 7,
  },

};
