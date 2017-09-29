'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,status } from 'constants/actionType/DataAnalysis.jsx';
import Folder from 'constants/actionType/Folder.jsx';
import AlarmTag from 'constants/actionType/AlarmTag.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

var _gatherInfo=null,_splits=Immutable.fromJS([]),_lastSplits=Immutable.fromJS([]);
const IntervalStatisticStore = assign({}, PrototypeStore, {
  setGatherInfo(info){
    _gatherInfo=Immutable.fromJS(info);
    _lastSplits=_splits;
  },
  getGatherInfo(){
    return _gatherInfo;
  },
  getSplits(){
    return _splits;
  },
  modifySplit(index,split,Status){
    switch (Status) {
      case status.MODIFY:
          _splits=_splits.setIn([index],Immutable.fromJS(split))
        break;
      case status.ADD:
          _splits=_splits.push(Immutable.fromJS(split))
        break;
      case status.DELETE:
          _splits=_splits.delete(index)
        break;
      default:
        break;
    }
  },
  refreshSplits(){
    _splits=_lastSplits;
  },
  doWidgetDtos(widgetDto){
    _splits=Immutable.fromJS([]);
    var array=widgetDto.WidgetParamArray;
    array.forEach(item=>{
      if(item.ParamKey==='SplitGatherTimeInterval'){
        var timeArr=item.ParamValue.split('-');
        _splits=_splits.push(Immutable.fromJS({
          StartMoment:timeArr[0]*1,
          EndMoment:timeArr[1]*1
        }))
      }
    })
  },
  clearAll(){
    _gatherInfo=null;
    _splits=Immutable.fromJS([]);
    _lastSplits=Immutable.fromJS([]);
  }
})

let FolderAction = Folder.Action;
IntervalStatisticStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case FolderAction.GET_WIDGETDTOS_SUCCESS:
          IntervalStatisticStore.doWidgetDtos(action.widgetDto[0]);
          IntervalStatisticStore.emitChange()
      break;
    case Action.GET_SPLIT_GATHER_INFO:
          IntervalStatisticStore.setGatherInfo(action.infos);
          IntervalStatisticStore.emitChange()
      break;
    case Action.MODIFY_SPLIT:
          IntervalStatisticStore.modifySplit(action.index,action.split,action.status);
          IntervalStatisticStore.emitChange()
      break;     
    case Action.REFRESH_SPLITS:
          IntervalStatisticStore.refreshSplits();
      break;  
    case Action.CLEAR_INTERVAL_INFO:
          IntervalStatisticStore.clearAll();
      break;    
  }
});

export default IntervalStatisticStore