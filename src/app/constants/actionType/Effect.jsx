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
    SET_ENERGY_EFFECT_ID:null,
    CLEAN_CREATE_SAVE_EFFECT:null,
    GET_ITEM_SUCCESS:null,
    UPDATE_ITEM_SUCCESS:null,
    CLEAN_EDIT_SAVE_EFFECT:null,
    GET_DETAIL_CHART:null,
    GET_BEST_SOLUTION:null,
    GET_GROUP_CHART:null,
    GET_BUILDING_CHART:null,
    GET_GROUP_TOTAL:null,
    GET_BUILDING_TOTAL:null,
    GET_MIN_YEAR:null,
    INIT_STORE:null,
    GET_CLASSIFICATION_DATA:null,
    IGNORE_SUCCESS:null,
    CLEAN_DETAIL_ALL_DATA:null,
    GET_CONFIG_CALENDAR_FOR_SAVEEFFECT:null,
    GET_CONFIG_CALENDAR_LOADING:null
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
  CalendarItemType:{
    WorkDayCalcTime:0,
    RestDayCalcTime:1,
    AllDayCalcTime:8
  },
  /// 触发类型： 2：实际值触发类型， 3：关联值触发类型
  TriggerType:{
    Relation:3,
    Actual:2
  },
  /// 触发条件类型(-1：大于，-2：大于等于，0：等于，1：小于，2：小于等于)
  TriggerConditionType:{
    Greater:-1,
    GreaterEqual:-2,
    Equal:0,
    Less:1,
    LessEqual:2
  }

};

