'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import Folder from 'constants/actionType/Folder.jsx';
import AlarmTag from 'constants/actionType/AlarmTag.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import {findIndex} from 'lodash-es';
import Immutable from 'immutable';
import Tag from 'constants/actionType/Tag.jsx';

var _tagList=null,_selectedTag=Immutable.fromJS([]);
const WeatherStore = assign({}, PrototypeStore, {
  setTagList(list){
    if(list===null){
      _tagList=null
    }else{
    _tagList=list.map(item=>({
      tagId:item.TagId,
      tagName:item.TagName,
      weatherType:item.WeatherType
    }))
    }

  },
  getTagList(){
    return _tagList
  },
  checkedTag(tag){
    var index=_selectedTag.findIndex((selected)=>(selected.get("tagId")===tag.tagId));
    if(index>-1){
      _selectedTag=_selectedTag.delete(index)
    }else{
      _selectedTag=_selectedTag.push(Immutable.fromJS(tag))
    }
  },
  checkedTagByTou(list){
    list.forEach(tag=>{
      this.checkedTag(tag)
    })
  },
    getSelectedTag(){
    return _selectedTag
  },
  doWidgetDtos: function(widgetDto) {
    _selectedTag=Immutable.fromJS([]);
    if (widgetDto.WidgetType == 'Labelling' || widgetDto.WidgetType == 'Ratio' || widgetDto.BizType == 'Energy' || widgetDto.BizType == 'UnitEnergy') {
      let convertWidgetOptions2TagOption = function(WidgetOptions) {
      let tagOptions = [];
        WidgetOptions.forEach(item => {
          if(item.NodeName){
          tagOptions.push({
            hierId: item.HierId,
            hierName: item.NodeName,
            dimId: item.DimensionId,
            dimName: item.DimensionName,
            tagId: item.TargetId,
            tagName: item.TargetName
          });
          }else{
          tagOptions.push({
            tagId: item.TargetId,
            tagName: item.TargetName
          });
          }

        });
        return Immutable.fromJS(tagOptions);
      };
      _selectedTag = convertWidgetOptions2TagOption(widgetDto.WidgetOptions);
    }
  },
})

let FolderAction = Folder.Action;
let AlarmTagAction = AlarmTag.Action;
let TagAction = Tag.Action;
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
  case TagAction.SET_TAGSTATUS_TAGLIST_TOU:
      WeatherStore.checkedTagByTou(action.tagList);
      WeatherStore.emitChange()
      break; 
  } 
});
export default WeatherStore