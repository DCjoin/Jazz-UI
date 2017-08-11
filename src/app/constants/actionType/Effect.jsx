import keyMirror from 'keymirror';

module.exports = {

  Action: keyMirror({
    UPDATE_TAGS: null,
    GET_ENERGY_EFFECT:null,
    GET_PREVIEW_CHART2:null,
    GET_PREVIEW_CHART3:null,
    GET_ENERGY_EFFECT:null,
    GET_EFFECT_RATE_TAG:null,
    SAVE_EFFECT_RATE_TAG:null,
    GET_EFFECT_DETAIL:null,
    DELETE_EFFECT_ITEM:null,
    GET_ENERGY_SOLUTION:null,
    GET_DRAFTS_SUCCESS:null,
    CHANGE_ENERGY_SYSTEM_FOR_EFFECT:null,
    ADD_ITEM:null,
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

// Immutable.fromJS({
// "Drafts": [
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 1",
//   "TagId": 4,
//   "TagName": "sample string 5",
//   EnergyEffectItemId:1
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 2",
//   "TagId": 4,
//   "TagName": "sample string 5",
//   EnergyEffectItemId:2
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5",
//   EnergyEffectItemId:3
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// },
// {
//   "ConfigStep": 1,
//   "EnergyProblemId": 2,
//   "EnergySolutionName": "sample string 3",
//   "TagId": 4,
//   "TagName": "sample string 5"
// }
// ],
// "EnergyEffects": [
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 20,
//   "ConfigedTagCount": 0,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6,
//   EnergyEffectItemId:1,
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 6,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 2,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// },
// {
//   "AnnualCostSaving": 1.1,
//   "CalcState": 1,
//   "ConfigedTagCount": 1,
//   "EnergyProblemId": 3,
//   "EnergySolutionName": "sample string 4",
//   "EnergySystem": 10,
//   "ExecutedTime": "2017-08-07T08:20:22",
//   "TotalTagCount": 6
// }
// ],
// "SavingRateConfigState": 1
// })
