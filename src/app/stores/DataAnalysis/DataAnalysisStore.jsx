
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import Dim from 'constants/actionType/Dim.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import EnergyStore from 'stores/Energy/EnergyStore.jsx';
import CommonFuns from 'util/Util.jsx';
import Immutable from 'immutable';
import {nodeType} from 'constants/TreeConstants.jsx';
import HierarchyStore from '../HierarchyStore.jsx';
import CurrentUserCustomerStore from '../CurrentUserCustomerStore.jsx';
import {find} from 'lodash';

var _gatherInfo=null,_widgetDto=null,_dimTree=null;
const AREA_DIM_EVENT = 'area_dim_event';

const DataAnalysisStore = assign({}, PrototypeStore, {
  setGatherInfo(data){
    _gatherInfo=data
  },
  getGatherInfo(){
    return _gatherInfo
  },
  getCalendarDisabled(chartType) {
    let tagOptions = EnergyStore.getTagOpions();
    if (!tagOptions) {
      return false;
    }
    let paramsObj = EnergyStore.getParamsObj(),
      timeRanges = paramsObj.timeRanges;

      let disabled = false;

      if (timeRanges.length > 1) {
        disabled = true;
      } else if (tagOptions.length > 1) {
        let hierId = null;
        tagOptions.forEach(option => {
          if (!hierId) {
        hierId = option.hierId;
      } else if (hierId !== option.hierId) {
        disabled = true;
        return;
      }
    });
  }
  if (chartType === 'pie' || chartType === 'rawdata') {
    disabled = true;
  }
  return disabled;
},

  getDisplayDate(time, isEndTime) {
    if (time !== null) {
      var hour = time.getHours();
      if (hour === 0 && isEndTime) {
        time = CommonFuns.dateAdd(time, -1, 'days');
        hour = 24;
      }
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDate();

      return year + '/' + month + '/' + day + ' ' + hour + ':00';
    } else {
      return '';
    }
  },
  setInitialWidgetDto(dto){
    _widgetDto=Immutable.fromJS(dto);
  },
  getInitialWidgetDto(){
    return _widgetDto;
  },
  setAreaDimTree(data,hierarchyId){
    let hierarchyNode=find(CurrentUserCustomerStore.getAll(), customer => customer.Id === hierarchyId * 1 );

    if(!hierarchyNode){
      hierarchyNode=find(HierarchyStore.getBuildingList(), building => building.Id === hierarchyId * 1 )
    }else {
      hierarchyNode.Type=nodeType.Customer;
    }
    _dimTree=Immutable.fromJS({
      Id:hierarchyNode.Id,
      Name:hierarchyNode.Name,
      Type:hierarchyNode.Type,
      Children:data
    })
  },
  getAreaDimTree(){
    return _dimTree;
  },
  getHierarchyName(hierarchyId){
    let hierarchyNode=find(CurrentUserCustomerStore.getAll(), customer => customer.Id === hierarchyId * 1 );
    if(!hierarchyNode){
      hierarchyNode=find(HierarchyStore.getBuildingList(), building => building.Id === hierarchyId * 1 )
    }
    return hierarchyNode.Name
  },
  dispose(){
    _gatherInfo=null;
    // _widgetDto=null;
  },
  emitAreaDim: function(args) {
    this.emit(AREA_DIM_EVENT, args);
  },
  addAreaDimListener: function(callback) {
    this.on(AREA_DIM_EVENT, callback);
  },
  removeAreaDimListener: function(callback) {
    this.removeListener(AREA_DIM_EVENT, callback);
    this.dispose();
  },
});

let DimAction=Dim.Action;
DataAnalysisStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_WIDGET_GATHER_INFO:
          DataAnalysisStore.setGatherInfo(action.data);
          DataAnalysisStore.emitChange()
      break;
    case Action.SET_INITIAL_WIDGET_DTO:
          DataAnalysisStore.setInitialWidgetDto(action.dto);
          break;
    case DimAction.LOAD_DIM_NODE:
          DataAnalysisStore.setAreaDimTree(action.dimList,action.hierarchyId);
          DataAnalysisStore.emitAreaDim()
        break;
    default:
  }
});

export default DataAnalysisStore;
