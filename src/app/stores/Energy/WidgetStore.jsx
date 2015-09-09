'use strict';

import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {Action} from '../../constants/actionType/Folder.jsx';

let _widgetDto = null;
let _selectedNode = null;
let _loading = false;
let _initPanelByWidgetDto = false;
var WidgetStore = assign({},PrototypeStore,{
  convertWidgetDto(widgetDto, selectedNode){
    _loading = false;
    _widgetDto = widgetDto[0];
  },
  startLoading(selectedNode){
    _selectedNode = selectedNode;
    _loading = true;
    _initPanelByWidgetDto = true;
  },
  getWidgetDto(){
    return _widgetDto;
  },
  getSelectedNode(){
    return _selectedNode;
  },
  getLoadingStatus(){
    return _loading;
  },
  setInitState(state){
    _initPanelByWidgetDto = state;
  },
  getInitState(){
    return _initPanelByWidgetDto;
  }
});

WidgetStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_WIDGETDTOS_LOADING:
        WidgetStore.startLoading(action.selectedNode);
        break;
      case Action.GET_WIDGETDTOS_SUCCESS:
        WidgetStore.convertWidgetDto(action.widgetDto);
        WidgetStore.emitChange();
        break;
      case Action.GET_WIDGETDTOS_ERROR:
        WidgetStore.convertWidgetDto(null);
        WidgetStore.emitChange();
        break;
      case Action.SET_WIDGET_INIT_STATE:
        WidgetStore.setInitState(action.state);
    }
});
module.exports = WidgetStore;
