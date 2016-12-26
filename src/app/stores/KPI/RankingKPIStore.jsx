
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,DataStatus,Unit} from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {List} from 'immutable';
import _ from 'lodash';
import CommonFuns from 'util/Util.jsx';
import moment from 'moment';

var _allKpis=null,
    _rankingConfig=null,
    _rankRecord=null;
const RankingKPIStore = assign({}, PrototypeStore, {

  setRankConfig(data){
    var {GroupKpiIds,UnitType,TopGroupKpiId}=data;
    _rankingConfig=Immutable.fromJS({
      GroupKpiIds,
      UnitType:UnitType || Unit.None,
      TopGroupKpiId:TopGroupKpiId || _allKpis.getIn([0,'Id'])
    })
  },

  getRankingConfig(){
      return _rankingConfig;
  },

  setAllKpis(data){
    _allKpis=Immutable.fromJS(data);
  },

  getAllKpis(){
    return _allKpis
  },

  merge(data){
    let {path,value,status}=data;
    let paths = path.split(".");
    if(status===DataStatus.ADD){
      var children = _rankingConfig.getIn(paths);
      value = children.push(value);
    }else
      if(status===DataStatus.DELETE){
        var children = _rankingConfig.getIn(paths),
            index=children.findIndex(child=>child===value);
            value=children.delete(index);
      }

          _rankingConfig=_rankingConfig.setIn(paths,value);

  },

  getAlgorithmList(){
      return([
        {
          Id:Unit.None,
          Name:I18N.Setting.KPI.Group.Ranking.None
        },
        {
          Id:Unit.OrignValue,
          Name:I18N.Setting.KPI.Group.Ranking.OrignValue
        },
        {
          Id:Unit.TotalAreaUnit,
          Name:I18N.Setting.KPI.Group.Ranking.TotalAreaUnit
        },
        {
          Id:Unit.TotalRoomUnit,
          Name:I18N.Setting.KPI.Group.Ranking.TotalRoomUnit
        },
        {
          Id:Unit.TotalPersonUnit,
          Name:I18N.Setting.KPI.Group.Ranking.TotalPersonUnit
        },
        {
          Id:Unit.MonthRatio,
          Name:I18N.Setting.KPI.Group.Ranking.MonthRatio
        }
      ])
  },

  getKpiList(){
    return _allKpis.map(kpi=>({
              payload: kpi.get('Id'),
              text: kpi.get('Name'),
    }))
  },

  setRankRecord(data){
    _rankRecord=Immutable.fromJS(data)
  },

  getRankRecord(){
    return _rankRecord
  },

  getDate(date){
    var j2d=CommonFuns.DataConverter.JsonToDateTime;
    return moment(j2d(date)).format(I18N.DateTimeFormat.IntervalFormat.Month)
  },

  dispose(){
    _allKpis=null;
    _rankingConfig=null;
    _rankRecord=null;
  }

});

RankingKPIStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_GROUP_KPIS:
         RankingKPIStore.setAllKpis(action.data);
         RankingKPIStore.emitChange();
         break;
    case Action.MERGE_GROUP_RANKING:
         RankingKPIStore.merge(action.data);
         RankingKPIStore.emitChange();
         break;
    case Action.GET_GROUP_RANKING:
         RankingKPIStore.setRankConfig(action.data);
         RankingKPIStore.emitChange();
         break;
    case Action.GET_RANK_RECORD:
         RankingKPIStore.setRankRecord(action.data);
         RankingKPIStore.emitChange();
         break;
    default:
  }
});

export default RankingKPIStore;
