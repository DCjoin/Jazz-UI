'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/Energy.jsx';
import Folder from 'constants/actionType/Folder.jsx';
import AlarmTag from 'constants/actionType/AlarmTag.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import {findIndex} from 'lodash-es';
import Immutable from 'immutable';

var _xAxis=0,_yAxis=0;
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
  dispose(){
    _xAxis=0;_yAxis=0;
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
   }
});

export default ScatterPlotStore