'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import Folder from 'constants/actionType/Folder.jsx';
import AlarmTag from 'constants/actionType/AlarmTag.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';

var _xAxis=0,_yAxis=0,_area=0,_energyData=null;
const BubbleStore = assign({}, PrototypeStore, {
  setAxisData(xAxis,yAxis,area){
    _xAxis=xAxis;
    _yAxis=yAxis;
    _area=area;
  },
  getXaxis(){
    return _xAxis
  },
  getYaxis(){
    return _yAxis
  },
  getArea(){
    return _area
  },
  setEnergyDataForSolution(energyData,xAxis,yAxis,area){
    _energyData=energyData;
    _xAxis=xAxis;
    _yAxis=yAxis;
    _area=area;
  },
  getEnergyDataForSolution(energyData){
    return _energyData;
  },
  clearAxis(){
    _xAxis=0;
    _yAxis=0;
    _area=0;
  },
  doWidgetDtos(widgetDto){
    if(widgetDto.ChartType==='Bubble' && widgetDto.WidgetOptions[0] && widgetDto.WidgetOptions[1]){
      _xAxis=widgetDto.WidgetOptions[0].TargetId;
      _yAxis=widgetDto.WidgetOptions[1].TargetId;
      _area=widgetDto.WidgetOptions[2].TargetId;
    }
  }
})

let FolderAction = Folder.Action;
BubbleStore.dispatchToken = AppDispatcher.register(function(action) {
   switch (action.type) {
    case Action.SET_BUBBLE_AXIS_DATA:
          BubbleStore.setAxisData(action.xAxis,action.yAxis,action.area);
          BubbleStore.emitChange()
      break;
    case Action.GET_BUBBLE_DATA:
          BubbleStore.setEnergyDataForSolution(action.energyData,action.XAxisTagId,action.YAxisTagId,action.AreaTagId);
          BubbleStore.emitChange()
    break;
    case FolderAction.GET_WIDGETDTOS_SUCCESS:
          BubbleStore.doWidgetDtos(action.widgetDto[0]);
          BubbleStore.emitChange()
    break;
    case Action.CLEAR_BUBBLE_AXIS_DATA:
          BubbleStore.clearAxis();
      break;
   }
});

export default BubbleStore