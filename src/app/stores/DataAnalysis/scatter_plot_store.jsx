'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import Folder from 'constants/actionType/Folder.jsx';
import AlarmTag from 'constants/actionType/AlarmTag.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import {findIndex} from 'lodash-es';
import Immutable from 'immutable';

var _xAxis=0,_yAxis=0,_energyData=null;
const ScatterPlotStore = assign({}, PrototypeStore, {
  setAxisData(xAxis,yAxis){
    _xAxis=xAxis;
    _yAxis=yAxis;
  },
  getXaxis(){
    return _xAxis
  },
  getYaxis(){
    return _yAxis
  },
  setEnergyDataForSolution(energyData){
    _energyData=energyData
  },
  getEnergyDataForSolution(energyData){
    return _energyData;
  },
  clearAxis(){
    _xAxis=0;
    _yAxis=0;
  },
  doWidgetDtos(widgetDto){
    if(widgetDto.ChartType==='ScatterPlot' && widgetDto.WidgetOptions[0] && widgetDto.WidgetOptions[1]){
      _xAxis=widgetDto.WidgetOptions[0].TargetId,
      _yAxis=widgetDto.WidgetOptions[1].TargetId
    }
  }
})

let FolderAction = Folder.Action;
let AlarmTagAction = AlarmTag.Action;
ScatterPlotStore.dispatchToken = AppDispatcher.register(function(action) {
   switch (action.type) {
    case Action.SET_SCATTER_AXIS_DATA:
          ScatterPlotStore.setAxisData(action.xAxis,action.yAxis);
          ScatterPlotStore.emitChange()
      break;
    case Action.GET_SCATTER_PLOT_DATA:
          ScatterPlotStore.setEnergyDataForSolution(action.energyData);
          ScatterPlotStore.emitChange()
    break;
    case FolderAction.GET_WIDGETDTOS_SUCCESS:
          ScatterPlotStore.doWidgetDtos(action.widgetDto[0]);
          ScatterPlotStore.emitChange()
    break;
    case Action.CLEAR_AXIS_DATA:
          ScatterPlotStore.clearAxis();
      break;
   }
});

export default ScatterPlotStore