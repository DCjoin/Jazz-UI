'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import Folder from 'constants/actionType/Folder.jsx';
import AlarmTag from 'constants/actionType/AlarmTag.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import {findIndex} from 'lodash-es';
import Immutable from 'immutable';

var _tagList=null,_selectedTag=Immutable.fromJS([]);
const WeatherStore = assign({}, PrototypeStore, {
  setTagList(list){
    _tagList=list
  },
  getTagList(){
    return _tagList
  },
  checkedTag(tag){
    var index=_selectedTag.findIndex((selected)=>selected.TagId===tag.TagId);
    if(index>-1){
      _selectedTag=_selectedTag.delete(index)
    }else{
      _selectedTag=_selectedTag.push(tag)
    }
  },
  getSelectedTag(){
    return _selectedTag
  },
  doWidgetDtos: function(widgetDto) {
    _selectedTag=Immutable.fromJS([]);
    if (widgetDto.WidgetType == 'Labelling' || widgetDto.WidgetType == 'Ratio' || widgetDto.BizType == 'Energy' || widgetDto.BizType == 'UnitEnergy') {
      _selectedTag = Immutable.fromJS(widgetDto.WidgetOptions);
    }
  },
})

let FolderAction = Folder.Action;
let AlarmTagAction = AlarmTag.Action;
WeatherStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_WEATHER_TAG:
          WeatherStore.setTagList(action.list);
          WeatherStore.emitChange()
      break;
    case Action.CLEAR_WEATHER_TAG:
          WeatherStore.setTagList(null);
          WeatherStore.emitChange()
      break;
  case Action.CLEAR_SELECTED_TAG:
        _selectedTag=Immutable.fromJS([]);
      break;
  case Action.CHECKED_TAG:
       WeatherStore.checkedTag(action.tag);
       WeatherStore.emitChange()
      break;  
  case FolderAction.GET_WIDGETDTOS_SUCCESS:
       WeatherStore.doWidgetDtos(action.widgetDto[0]);
       WeatherStore.emitChange()
       break;   
  case AlarmTagAction.REMOVE_SEARCH_TAGLIST_CHANGED:
      WeatherStore.checkedTag(action.tagNode);
      WeatherStore.emitChange()
      break; 
  } 
});
export default WeatherStore